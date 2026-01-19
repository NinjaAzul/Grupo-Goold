const { execSync } = require('child_process');
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
};

const connectionString = `mysql://${encodeURIComponent(dbConfig.username)}:${encodeURIComponent(dbConfig.password)}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;

const outputPath = path.join(__dirname, '../docs/schema.dbml');
const outputDir = path.dirname(outputPath);

console.log('🔄 Generating DBML using @dbml/cli...');
console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
console.log(`   Database: ${dbConfig.database}`);
console.log(`   Environment: ${isInsideDocker ? 'Docker' : 'Local'}`);

try {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }


  const dbmlCliPath = path.join(__dirname, '../node_modules/@dbml/cli/bin/db2dbml.js');
  
  if (!fs.existsSync(dbmlCliPath)) {
    throw new Error('@dbml/cli not found. Please run: npm install');
  }

  let dbmlOutput;
  
  try {
    const command = `node "${dbmlCliPath}" mysql "${connectionString}"`;
    dbmlOutput = execSync(command, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
    });
  } catch (stdoutError) {
    const stdoutErrorMsg = stdoutError.message || stdoutError.toString();
    const stderr = stdoutError.stderr ? stdoutError.stderr.toString() : '';
    const stdout = stdoutError.stdout ? stdoutError.stdout.toString() : '';
    
    if (stdout && stdout.trim().length > 0) {
      dbmlOutput = stdout;
    } else {
      throw new Error(`Failed to generate DBML: ${stdoutErrorMsg}\nStderr: ${stderr}\nStdout: ${stdout}`);
    }
  }

  
  if (dbmlOutput) {
    const header = `// Generated DBML from database schema using @dbml/cli
// Database: ${dbConfig.database}
// Generated at: ${new Date().toISOString()}

`;
    fs.writeFileSync(outputPath, header + dbmlOutput);
  } else if (fs.existsSync(outputPath)) {
    
    const dbmlContent = fs.readFileSync(outputPath, 'utf8');
    
    if (!dbmlContent.includes('// Generated DBML from database schema')) {
      const header = `// Generated DBML from database schema using @dbml/cli
// Database: ${dbConfig.database}
// Generated at: ${new Date().toISOString()}

`;
      fs.writeFileSync(outputPath, header + dbmlContent);
    }
  } else {
    throw new Error('DBML file was not generated');
  }

  console.log(`✅ DBML generated successfully in: ${outputPath}`);
  console.log(`\n💡 You can view the diagram at: https://dbdiagram.io/`);
  console.log(`   Just copy the file content and paste it into the editor.`);
} catch (error) {
  console.error('\n❌ Error generating DBML:');
  console.error(`   Type: ${error.name || 'Unknown'}`);
  console.error(`   Message: ${error.message || error.toString()}`);
  
  if (error.message && (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND'))) {
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
    console.error('\n   4. Make sure @dbml/cli is installed: npm install');
  } else if (error.message && error.message.includes('command not found')) {
    console.error('\n💡 Make sure @dbml/cli is installed:');
    console.error('   npm install --save-dev @dbml/cli');
  }
  
  process.exit(1);
}

