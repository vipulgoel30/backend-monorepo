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

      KAFKA_CLIENT_ID: string;
      KAFKA_BROKER: string;

      REDIS_USERNAME: string;
      REDIS_PASSWORD: string;
      REDIS_URL: string;
      REDIS_PORT: string;
    }
  }
}

export {};
