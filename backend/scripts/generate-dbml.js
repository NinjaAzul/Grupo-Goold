const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Detecta se está rodando no Docker ou localmente
const isInsideDocker = fs.existsSync('/.dockerenv');

// Se executado localmente e DB_HOST for 'mysql', força 'localhost'
// porque 'mysql' só funciona dentro da rede Docker
let dbHost = process.env.DB_HOST;
if (!isInsideDocker && dbHost === 'mysql') {
  dbHost = 'localhost';
  console.log('⚠️  Executando localmente: usando localhost ao invés de mysql');
}

// Configuração do Sequelize
const dbConfig = {
  database: process.env.DB_NAME || 'grupo_goold',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  host: dbHost || (isInsideDocker ? 'mysql' : 'localhost'),
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    connectTimeout: 10000,
  },
};

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    dialectOptions: dbConfig.dialectOptions,
  }
);

/**
 * Converte tipo MySQL para tipo DBML
 */
function mapMySQLTypeToDBML(dataType, columnDefault) {
  const type = dataType.toUpperCase();
  
  const typeMap = {
    'INT': 'int',
    'INTEGER': 'int',
    'TINYINT': 'int',
    'SMALLINT': 'int',
    'MEDIUMINT': 'int',
    'BIGINT': 'bigint',
    'DECIMAL': 'decimal',
    'NUMERIC': 'decimal',
    'FLOAT': 'float',
    'DOUBLE': 'double',
    'BIT': 'boolean',
    'BOOLEAN': 'boolean',
    'BOOL': 'boolean',
    'CHAR': 'varchar',
    'VARCHAR': 'varchar',
    'TEXT': 'text',
    'TINYTEXT': 'text',
    'MEDIUMTEXT': 'text',
    'LONGTEXT': 'text',
    'BLOB': 'blob',
    'DATE': 'date',
    'TIME': 'time',
    'DATETIME': 'datetime',
    'TIMESTAMP': 'timestamp',
    'YEAR': 'year',
    'JSON': 'json',
  };
  
  return typeMap[type] || 'varchar';
}

/**
 * Gera diagrama ERD em formato DBML
 */
async function generateDBML() {
  try {
    console.log('🔄 Tentando conectar ao banco de dados...');
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   Ambiente: ${isInsideDocker ? 'Docker' : 'Local'}`);
    
    await sequelize.authenticate();
    console.log('✅ Conexão com banco de dados estabelecida.');

    // Busca todas as tabelas do banco
    const [tables] = await sequelize.query(
      "SELECT TABLE_NAME, TABLE_COMMENT FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'",
      {
        replacements: [process.env.DB_NAME || 'grupo_goold'],
      }
    );

    const dbmlContent = [];

    // Adiciona comentário no início
    dbmlContent.push('// Generated DBML from database schema');
    dbmlContent.push(`// Database: ${dbConfig.database}`);
    dbmlContent.push(`// Generated at: ${new Date().toISOString()}`);
    dbmlContent.push('');

    // Processa cada tabela
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      const tableComment = table.TABLE_COMMENT || '';
      
      // Adiciona comentário da tabela se existir
      if (tableComment) {
        dbmlContent.push(`// ${tableComment}`);
      }
      
      dbmlContent.push(`Table ${tableName} {`);

      // Busca colunas
      const [columns] = await sequelize.query(
        `SELECT 
          COLUMN_NAME,
          DATA_TYPE,
          COLUMN_TYPE,
          IS_NULLABLE,
          COLUMN_KEY,
          COLUMN_DEFAULT,
          COLUMN_COMMENT,
          CHARACTER_MAXIMUM_LENGTH,
          NUMERIC_PRECISION,
          NUMERIC_SCALE
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION`,
        {
          replacements: [process.env.DB_NAME || 'grupo_goold', tableName],
        }
      );

      for (const column of columns) {
        // Verifica se é ENUM
        let typeWithSize;
        if (column.COLUMN_TYPE && column.COLUMN_TYPE.toUpperCase().startsWith('ENUM')) {
          // Para DBML, vamos usar varchar para evitar problemas de sintaxe com enum
          typeWithSize = 'varchar(50)';
        } else {
          const dbmlType = mapMySQLTypeToDBML(column.DATA_TYPE, column.COLUMN_DEFAULT);
          
          // Monta o tipo com tamanho se aplicável
          typeWithSize = dbmlType;
          if (column.CHARACTER_MAXIMUM_LENGTH) {
            typeWithSize = `${dbmlType}(${column.CHARACTER_MAXIMUM_LENGTH})`;
          } else if (column.NUMERIC_PRECISION && column.NUMERIC_SCALE) {
            typeWithSize = `${dbmlType}(${column.NUMERIC_PRECISION},${column.NUMERIC_SCALE})`;
          } else if (column.NUMERIC_PRECISION) {
            typeWithSize = `${dbmlType}(${column.NUMERIC_PRECISION})`;
          }
        }
        
        // Monta a linha da coluna
        let columnLine = `  ${column.COLUMN_NAME} ${typeWithSize}`;
        
        // Coleta todos os atributos inline
        const attributes = [];
        
        // Adiciona constraints
        if (column.COLUMN_KEY === 'PRI') {
          attributes.push('pk');
        } else if (column.COLUMN_KEY === 'UNI') {
          attributes.push('unique');
        }
        
        if (column.IS_NULLABLE === 'NO') {
          attributes.push('not null');
        }
        
        // Adiciona default (se não for função SQL)
        if (column.COLUMN_DEFAULT !== null && column.COLUMN_DEFAULT !== undefined) {
          // Ignora defaults que são funções SQL (CURRENT_TIMESTAMP, etc)
          const defaultStr = String(column.COLUMN_DEFAULT);
          if (!defaultStr.includes('CURRENT_TIMESTAMP') && !defaultStr.includes('NOW()')) {
            // Para números, não usa aspas. Para strings, usa aspas.
            let defaultValue;
            if (typeof column.COLUMN_DEFAULT === 'number') {
              defaultValue = column.COLUMN_DEFAULT;
            } else {
              // Remove aspas se já tiver e trata como string
              const cleanDefault = String(column.COLUMN_DEFAULT).replace(/^['"]|['"]$/g, '');
              // Tenta converter para número se possível
              const numValue = Number(cleanDefault);
              if (!isNaN(numValue) && cleanDefault === numValue.toString()) {
                defaultValue = numValue;
              } else {
                defaultValue = `'${cleanDefault}'`;
              }
            }
            attributes.push(`default: ${defaultValue}`);
          }
        }
        
        // Adiciona todos os atributos de uma vez
        // DBML aceita: [attr1, attr2] (vírgula separada) - sintaxe mais segura
        if (attributes.length > 0) {
          columnLine += ` [${attributes.join(', ')}]`;
        }
        
        dbmlContent.push(columnLine);
      }

      dbmlContent.push('}');
      dbmlContent.push('');
    }

    // Busca relacionamentos (foreign keys)
    const [relationships] = await sequelize.query(
      `SELECT 
        kcu.TABLE_NAME,
        kcu.COLUMN_NAME,
        kcu.REFERENCED_TABLE_NAME,
        kcu.REFERENCED_COLUMN_NAME,
        rc.UPDATE_RULE,
        rc.DELETE_RULE
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
      INNER JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
        ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
        AND kcu.TABLE_SCHEMA = rc.CONSTRAINT_SCHEMA
      WHERE kcu.TABLE_SCHEMA = ? 
        AND kcu.REFERENCED_TABLE_NAME IS NOT NULL`,
      {
        replacements: [process.env.DB_NAME || 'grupo_goold'],
      }
    );

    if (relationships.length > 0) {
      dbmlContent.push('// Relationships');
      dbmlContent.push('');
      
      for (const rel of relationships) {
        // DBML usa a sintaxe: Ref: table1.column > table2.column
        dbmlContent.push(
          `Ref: ${rel.TABLE_NAME}.${rel.COLUMN_NAME} > ${rel.REFERENCED_TABLE_NAME}.${rel.REFERENCED_COLUMN_NAME}`
        );
      }
    }

    // Salva o arquivo
    const outputPath = path.join(__dirname, '../docs/schema.dbml');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, dbmlContent.join('\n'));
    console.log(`✅ DBML gerado com sucesso em: ${outputPath}`);
    console.log(`\n💡 Você pode visualizar o diagrama em: https://dbdiagram.io/`);
    console.log(`   Basta copiar o conteúdo do arquivo e colar no editor.`);

    await sequelize.close();
  } catch (error) {
    console.error('\n❌ Erro ao gerar DBML:');
    console.error(`   Tipo: ${error.name}`);
    console.error(`   Mensagem: ${error.message}`);
    
    if (error.name === 'SequelizeConnectionError') {
      console.error('\n💡 Possíveis soluções:');
      
      if (!isInsideDocker) {
        console.error('   ⚠️  Você está executando LOCALMENTE.');
        console.error('   O hostname "mysql" só funciona dentro da rede Docker.');
        console.error('\n   Opções:');
        console.error('   1. Execute dentro do container Docker:');
        console.error('      docker-compose exec backend npm run dbml:generate');
        console.error('   2. Ou configure no .env:');
        console.error('      DB_HOST=localhost');
        console.error('      DB_PORT=3306');
      } else {
        console.error('   ⚠️  Você está executando DENTRO do Docker.');
        console.error('   Verifique:');
        console.error('   1. Se o MySQL está rodando: docker-compose ps');
        console.error('   2. Se os containers estão na mesma rede');
      }
      
      console.error('\n   3. Verifique as variáveis de ambiente no arquivo .env');
    }
    
    process.exit(1);
  }
}

generateDBML();

