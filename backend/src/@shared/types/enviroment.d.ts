import { EnvironmentVariables } from '@shared/environments';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvironmentVariables {
      [key: string]: string | undefined;
    }
  }
}

export {};
