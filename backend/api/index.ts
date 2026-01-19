import type { VercelRequest, VercelResponse } from '@vercel/node';
import 'reflect-metadata';
import 'dotenv/config';

let app: any;
let sequelize: any;
let dbInitialized = false;

async function initializeApp() {
  if (!app) {
    try {
      console.log('Initializing app...');
      
      const appModule = await import('../src/infra/app');
      app = appModule.app;
      console.log('App imported successfully');
      
      const dbModule = await import('../src/@shared/config/database');
      sequelize = dbModule.default;
      console.log('Database module imported successfully');
      
      await import('../src/infra/database/models');
      console.log('Models imported successfully');
    } catch (error: any) {
      console.error('Error initializing app:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
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
    await initializeApp();
    await ensureDbConnection();
    
    if (!app) {
      throw new Error('App not initialized');
    }
    
    return new Promise((resolve, reject) => {
      try {
        const result = app(req, res);
        if (result && typeof result.then === 'function') {
          result.then(resolve).catch(reject);
        } else {
          resolve(result);
        }
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
