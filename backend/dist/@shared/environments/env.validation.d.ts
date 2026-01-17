import { Secret, type SignOptions } from 'jsonwebtoken';
export declare enum NODE_ENV_ENUM {
    DEVELOPMENT = "development",
    PRODUCTION = "production",
    TEST = "test"
}
export declare class EnvironmentVariables {
    NODE_ENV: NODE_ENV_ENUM;
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME_TEST?: string;
    ADMIN_DEFAULT_PASSWORD?: string;
    JWT_SECRET: Secret | string;
    JWT_EXPIRES_IN: SignOptions['expiresIn'];
    FRONTEND_URL?: string;
}
export declare function validateEnvironment(): Promise<void>;
//# sourceMappingURL=env.validation.d.ts.map