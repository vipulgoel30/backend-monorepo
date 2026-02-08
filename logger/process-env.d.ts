declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string;
      NODE_ENV: string;
      PORT: string;
      LOG_LEVEL: string;
    }
  }
}

export {};
