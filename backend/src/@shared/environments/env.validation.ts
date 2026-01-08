import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { logger } from '../utils';
import { Secret, type SignOptions } from 'jsonwebtoken';

export enum NODE_ENV_ENUM {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export class EnvironmentVariables {
  @IsEnum(NODE_ENV_ENUM)
  @IsNotEmpty()
  NODE_ENV!: NODE_ENV_ENUM;

  @IsNumber()
  @Min(1)
  @Max(65535)
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  DB_HOST!: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  DB_PORT!: number;

  @IsString()
  @IsNotEmpty()
  DB_NAME!: string;

  @IsString()
  @IsNotEmpty()
  DB_USER!: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD!: string;

  @IsOptional()
  @IsString()
  DB_NAME_TEST?: string;

  @IsString()
  @IsOptional()
  ADMIN_DEFAULT_PASSWORD?: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: Secret | string;

  @IsNotEmpty()
  JWT_EXPIRES_IN!: SignOptions['expiresIn'];
}

export async function validateEnvironment(): Promise<void> {
  const env = plainToInstance(EnvironmentVariables, {
    NODE_ENV: process.env.NODE_ENV,
    PORT: Number(process.env.PORT) || 3001,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: Number(process.env.DB_PORT),
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME_TEST: process.env.DB_NAME_TEST,
    ADMIN_DEFAULT_PASSWORD: process.env.ADMIN_DEFAULT_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  }) as EnvironmentVariables;

  const errors = await validate(env);

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => {
        const constraints = Object.values(error.constraints || {});
        return `${error.property}: ${constraints.join(', ')}`;
      })
      .join('\n');

    logger.error('❌ Environment validation failed:');
    logger.error(errorMessages);
    logger.error(
      '\nPlease check your .env file and ensure all required variables are set correctly.'
    );
    process.exit(1);
  }

  logger.info('✅ Environment variables validated successfully');
}
