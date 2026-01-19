import { Sequelize } from 'sequelize';
const { Umzug, SequelizeStorage } = require('umzug');
import path from 'path';
import sequelize from '@shared/config/database';

interface MigrationResolverParams {
  name: string;
  path?: string;
  context: any;
}

export class MigrateService {
  async execute(): Promise<{ stdout: string; stderr: string }> {
    try {
      const fs = require('fs');
      
      const possiblePaths = [
        path.resolve(process.cwd(), 'src/infra/database/migrations'),
        path.resolve(__dirname, '../../../../infra/database/migrations'),
        path.resolve(__dirname, '../../../../../src/infra/database/migrations'),
      ];

      let migrationsPath: string | null = null;
      
      for (const testPath of possiblePaths) {
        if (fs.existsSync(testPath)) {
          const files = fs.readdirSync(testPath).filter((f: string) => f.endsWith('.js'));
          if (files.length > 0) {
            migrationsPath = testPath;
            console.log(`Found migrations at: ${migrationsPath} (${files.length} files)`);
            break;
          }
        }
      }

      if (!migrationsPath) {
        throw new Error(`Migrations folder not found. Tried: ${possiblePaths.join(', ')}`);
      }

      const umzug = new Umzug({
        migrations: {
          glob: path.join(migrationsPath, '*.js'),
          resolve: ({ name, path: migrationPath, context }: MigrationResolverParams) => {
            if (!migrationPath) {
              throw new Error(`Migration path not found for ${name}`);
            }
            const migration = require(migrationPath);
            return {
              name,
              up: async () => {
                if (migration.up) {
                  return migration.up(context, Sequelize);
                }
              },
              down: async () => {
                if (migration.down) {
                  return migration.down(context, Sequelize);
                }
              },
            };
          },
        },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: {
          info: (msg: string) => console.log(`[Umzug] ${msg}`),
          warn: (msg: string) => console.warn(`[Umzug] ${msg}`),
          error: (msg: string) => console.error(`[Umzug] ${msg}`),
          debug: (msg: string) => console.debug(`[Umzug] ${msg}`),
        },
      });

      const executed = await umzug.up();
      
      const executedNames = executed.map((m: { name: string }) => m.name);
      
      return {
        stdout: executedNames.length > 0
          ? `Executed migrations: ${executedNames.join(', ')}`
          : 'No new migrations to execute',
        stderr: '',
      };
    } catch (error: any) {
      console.error('Migration error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      const errorMessage = error.message || 'Unknown error';
      throw new Error(`Migration failed: ${errorMessage}`);
    }
  }
}
