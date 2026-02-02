declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      NODE_ENV: string;
      PORT: string;
      MEGA_EMAIL: string;
      MEGA_PASSWORD: string;
    }
  }
}

export {};
