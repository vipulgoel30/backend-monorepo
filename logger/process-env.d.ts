declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string;
      NODE_ENV: string;

      SERVER_PORT: string;
      SERVER_HOSTNAME: string;

      LOG_LEVEL: string;
      MONGO_HOSTNAME: string;
      MONGO_PORT: string;
      MONGO_USERNAME: string;
      MONGO_PASSWORD: string;
      MONGO_DB: string;
    }
  }
}

export {};
