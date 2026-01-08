

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;
      ORVARL_TARGET: string;
    }
  }
}

export {};
