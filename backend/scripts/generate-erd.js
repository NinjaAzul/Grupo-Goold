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
 * Gera diagrama ERD em formato Mermaid
 */
async function generateERD() {
  try {
    console.log('🔄 Tentando conectar ao banco de dados...');
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   Ambiente: ${isInsideDocker ? 'Docker' : 'Local'}`);
    
    await sequelize.authenticate();
    console.log('✅ Conexão com banco de dados estabelecida.');

    // Busca todas as tabelas do banco
    const [tables] = await sequelize.query(
      "SELECT TABLE_NAME, TABLE_COMMENT FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?",
      {
        replacements: [process.env.DB_NAME || 'grupo_goold'],
      }
    );

    // Busca colunas e relacionamentos
    const erdContent = ['```mermaid', 'erDiagram'];

    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      const [columns] = await sequelize.query(
        `SELECT 
          COLUMN_NAME,
          DATA_TYPE,
          IS_NULLABLE,
          COLUMN_KEY,
          COLUMN_DEFAULT,
          COLUMN_COMMENT
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION`,
        {
          replacements: [process.env.DB_NAME || 'grupo_goold', tableName],
        }
      );

      // Adiciona entidade
      erdContent.push(`    ${tableName} {`);

      for (const column of columns) {
        const dataType = column.DATA_TYPE.toUpperCase();
        const nullable = column.IS_NULLABLE === 'YES' ? ' nullable' : '';
        const key = column.COLUMN_KEY === 'PRI' ? ' PK' : column.COLUMN_KEY === 'UNI' ? ' UK' : '';
        const comment = column.COLUMN_COMMENT ? ` "${column.COLUMN_COMMENT}"` : '';
        
        erdContent.push(
          `        ${dataType} ${column.COLUMN_NAME}${key}${nullable}${comment}`
        );
      }

      erdContent.push('    }');
    }

    // Busca relacionamentos (foreign keys)
    const [relationships] = await sequelize.query(
      `SELECT 
        TABLE_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ? 
        AND REFERENCED_TABLE_NAME IS NOT NULL`,
      {
        replacements: [process.env.DB_NAME || 'grupo_goold'],
      }
    );

    for (const rel of relationships) {
      erdContent.push(
        `    ${rel.TABLE_NAME} ||--o{ ${rel.REFERENCED_TABLE_NAME} : "has"`
      );
    }

    erdContent.push('```');

    // Salva o arquivo
    const outputPath = path.join(__dirname, '../docs/ERD.md');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, erdContent.join('\n'));
    console.log(`✅ ERD gerado com sucesso em: ${outputPath}`);

    await sequelize.close();
    console.log('✅ ERD gerado com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro ao gerar ERD:');
    console.error(`   Tipo: ${error.name}`);
    console.error(`   Mensagem: ${error.message}`);
    
    if (error.name === 'SequelizeConnectionError') {
      console.error('\n💡 Possíveis soluções:');
      
      if (!isInsideDocker) {
        console.error('   ⚠️  Você está executando LOCALMENTE.');
        console.error('   O hostname "mysql" só funciona dentro da rede Docker.');
        console.error('\n   Opções:');
        console.error('   1. Execute dentro do container Docker:');
        console.error('      docker-compose exec backend npm run erd:generate');
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

generateERD();

