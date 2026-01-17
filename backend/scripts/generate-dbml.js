const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const isInsideDocker = fs.existsSync('/.dockerenv');

let dbHost = process.env.DB_HOST;
if (!isInsideDocker && dbHost === 'mysql') {
  dbHost = 'localhost';
  console.log('⚠️  Executing locally: using localhost instead of mysql');
}

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

async function generateDBML() {
  try {
    console.log('🔄 Trying to connect to the database...');   
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   Environment: ${isInsideDocker ? 'Docker' : 'Local'}`);
    
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    const [tables] = await sequelize.query(
      "SELECT TABLE_NAME, TABLE_COMMENT FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'",
      {
        replacements: [process.env.DB_NAME || 'grupo_goold'],
      }
    );

    const dbmlContent = [];

    dbmlContent.push('// Generated DBML from database schema');
    dbmlContent.push(`// Database: ${dbConfig.database}`);
    dbmlContent.push(`// Generated at: ${new Date().toISOString()}`);
    dbmlContent.push('');

    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      const tableComment = table.TABLE_COMMENT || '';
      
      if (tableComment) {
        dbmlContent.push(`// ${tableComment}`);
      }
      
      dbmlContent.push(`Table ${tableName} {`);

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
        
        let typeWithSize;
        if (column.COLUMN_TYPE && column.COLUMN_TYPE.toUpperCase().startsWith('ENUM')) {
          typeWithSize = 'varchar(50)';
        } else {
          const dbmlType = mapMySQLTypeToDBML(column.DATA_TYPE, column.COLUMN_DEFAULT);
          
          typeWithSize = dbmlType;
          if (column.CHARACTER_MAXIMUM_LENGTH) {
            typeWithSize = `${dbmlType}(${column.CHARACTER_MAXIMUM_LENGTH})`;
          } else if (column.NUMERIC_PRECISION && column.NUMERIC_SCALE) {
            typeWithSize = `${dbmlType}(${column.NUMERIC_PRECISION},${column.NUMERIC_SCALE})`;
          } else if (column.NUMERIC_PRECISION) {
            typeWithSize = `${dbmlType}(${column.NUMERIC_PRECISION})`;
          }
        }
        
        let columnLine = `  ${column.COLUMN_NAME} ${typeWithSize}`;
        
        const attributes = [];
        
        if (column.COLUMN_KEY === 'PRI') {
          attributes.push('pk');
        } else if (column.COLUMN_KEY === 'UNI') {
          attributes.push('unique');
        }
        
        if (column.IS_NULLABLE === 'NO') {
          attributes.push('not null');
        }
        
        if (column.COLUMN_DEFAULT !== null && column.COLUMN_DEFAULT !== undefined) {
          const defaultStr = String(column.COLUMN_DEFAULT);
          if (!defaultStr.includes('CURRENT_TIMESTAMP') && !defaultStr.includes('NOW()')) {
            let defaultValue;
            if (typeof column.COLUMN_DEFAULT === 'number') {
              defaultValue = column.COLUMN_DEFAULT;
            } else {
              const cleanDefault = String(column.COLUMN_DEFAULT).replace(/^['"]|['"]$/g, '');
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
        
        if (attributes.length > 0) {
          columnLine += ` [${attributes.join(', ')}]`;
        }
        
        dbmlContent.push(columnLine);
      }

      dbmlContent.push('}');
      dbmlContent.push('');
    }

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
        dbmlContent.push(
          `Ref: ${rel.TABLE_NAME}.${rel.COLUMN_NAME} > ${rel.REFERENCED_TABLE_NAME}.${rel.REFERENCED_COLUMN_NAME}`
        );
      }
    }

    const outputPath = path.join(__dirname, '../docs/schema.dbml');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, dbmlContent.join('\n'));
    console.log(`✅ DBML generated successfully in: ${outputPath}`); 
    console.log(`\n💡 You can view the diagram at: https://dbdiagram.io/`);
    console.log(`   Just copy the file content and paste it into the editor.`);

    await sequelize.close();
  } catch (error) {
    console.error('\n❌ Error generating DBML:');
    console.error(`   Type: ${error.name}`);
    console.error(`   Message: ${error.message}`);
    
    if (error.name === 'SequelizeConnectionError') {
      console.error('\n💡 Possible solutions:');
      
      if (!isInsideDocker) {
          console.error('   ⚠️  You are executing LOCALLY.');
        console.error('   The hostname "mysql" only works inside the Docker network.');
        console.error('\n   Options:');
        console.error('   1. Execute inside the Docker container:');
        console.error('      docker-compose exec backend npm run dbml:generate');
        console.error('   2. Or configure in .env:');
        console.error('      DB_HOST=localhost');
        console.error('      DB_PORT=3306');
      } else {
        console.error('   ⚠️  You are executing INSIDE the Docker container.');
        console.error('   Verifique:');
        console.error('   1. If the MySQL is running: docker-compose ps');
        console.error('   2. If the containers are on the same network');
      }
      
      console.error('\n   3. Check the environment variables in the .env file');
    }
    
    process.exit(1);
  }
}

generateDBML();

