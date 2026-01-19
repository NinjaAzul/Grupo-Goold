import type { VercelRequest, VercelResponse } from '@vercel/node';

require('reflect-metadata');
require('dotenv/config');


try {
  require('mysql2');
  console.log('mysql2 module loaded successfully');
} catch (error: any) {
  console.error('Error loading mysql2:', error.message);
  throw new Error('mysql2 package is required but not found. Please ensure it is installed.');
}

let app: any;
let sequelize: any;
let dbInitialized = false;

function initializeApp() {
  if (!app) {
    try {
      console.log('Initializing app...');
      console.log('Current working directory:', process.cwd());
      console.log('__dirname:', __dirname);
      
      const fs = require('fs');
      const path = require('path');
      const distPath = path.join(__dirname, '../dist');
      console.log('Checking dist path:', distPath);
      console.log('Dist exists:', fs.existsSync(distPath));
      
      if (!fs.existsSync(distPath)) {
        throw new Error(`Dist folder not found at ${distPath}. Make sure 'npm run build' was executed.`);
      }
      
      const appModule = require('../dist/infra/app');
      app = appModule.app;
      console.log('App imported successfully');
      
      const dbModule = require('../dist/@shared/config/database');
      sequelize = dbModule.default;
      console.log('Database module imported successfully');
      
      require('../dist/infra/database/models');
      console.log('Models imported successfully');
    } catch (error: any) {
      console.error('Error initializing app:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
        code: error?.code,
      });
      throw error;
    }
  }
}

async function ensureDbConnection() {
  if (!dbInitialized && sequelize) {
    try {
      await sequelize.authenticate();
      dbInitialized = true;
      console.log('Database connected successfully');
    } catch (error: any) {
      console.error('Database connection error:', {
        message: error?.message,
        code: error?.code,
        errno: error?.errno,
        sqlState: error?.sqlState,
      });
    }
  }
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    initializeApp();
    await ensureDbConnection();
    
    if (!app) {
      throw new Error('App not initialized');
    }
    
    return new Promise((resolve, reject) => {
      try {
        app.handle(req, res, (err?: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(undefined);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  } catch (error: any) {
    const errorDetails = {
      message: error?.message,
      name: error?.name,
      stack: error?.stack?.split('\n').slice(0, 10).join('\n'),
      code: error?.code,
    };
    
    console.error('Handler error:', JSON.stringify(errorDetails, null, 2));
    
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred',
        ...(process.env.NODE_ENV !== 'production' && {
          details: errorDetails,
        }),
      });
    }
  }
};
