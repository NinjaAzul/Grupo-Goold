import { Sequelize } from 'sequelize';
import path from 'path';
import { readdirSync, existsSync } from 'fs';
import sequelize from '@shared/config/database';

export class SeedService {
  async execute(): Promise<{ stdout: string; stderr: string }> {
    try {
      const possiblePaths = [
        path.resolve(process.cwd(), 'src/infra/database/seeders'),
        path.resolve(__dirname, '../../../../infra/database/seeders'),
        path.resolve(__dirname, '../../../../../src/infra/database/seeders'),
      ];

      let seedersPath: string | null = null;
      
      for (const testPath of possiblePaths) {
        if (existsSync(testPath)) {
          const files = readdirSync(testPath).filter((f: string) => f.endsWith('.js'));
          if (files.length > 0) {
            seedersPath = testPath;
            console.log(`Found seeders at: ${seedersPath} (${files.length} files)`);
            break;
          }
        }
      }

      if (!seedersPath) {
        throw new Error(`Seeders folder not found. Tried: ${possiblePaths.join(', ')}`);
      }

      const seedFiles = readdirSync(seedersPath)
        .filter((file) => file.endsWith('.js'))
        .sort();

      const executedSeeds: string[] = [];

      for (const seedFile of seedFiles) {
        try {
          const seedPath = path.join(seedersPath, seedFile);
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const seed = require(seedPath);

          if (seed.up) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { Sequelize: SequelizeType } = require('sequelize');
            await seed.up(sequelize.getQueryInterface(), SequelizeType);
            executedSeeds.push(seedFile);
            console.log(`Executed seed: ${seedFile}`);
          }
        } catch (error: any) {
          if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
            console.log(`Seed ${seedFile} already executed or skipped`);
          } else {
            console.error(`Error executing seed ${seedFile}:`, error.message);
            throw error;
          }
        }
      }

      return {
        stdout: executedSeeds.length > 0
          ? `Executed seeds: ${executedSeeds.join(', ')}`
          : 'No new seeds to execute',
        stderr: '',
      };
    } catch (error: any) {
      console.error('Seed error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      const errorMessage = error.message || 'Unknown error';
      throw new Error(`Seed failed: ${errorMessage}`);
    }
  }
}
