require('dotenv').config();
const fs = require('fs');

// Detecta se está rodando no Docker ou localmente
const isInsideDocker = fs.existsSync('/.dockerenv');
// Se executado localmente e DB_HOST for 'mysql', força 'localhost'
let dbHost = process.env.DB_HOST;
if (!isInsideDocker && dbHost === 'mysql') {
  dbHost = 'localhost';
}

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'grupo_goold',
    host: dbHost || (isInsideDocker ? 'mysql' : 'localhost'),
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log,
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME_TEST || 'grupo_goold_test',
    host: dbHost || (isInsideDocker ? 'mysql' : 'localhost'),
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: dbHost || process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  },
};

