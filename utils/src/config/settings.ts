export const utilsSettings = {
  RETRY: {
    COUNT: 3,
    INTERVAL: 100,
    MAX_INTERVAL: 500,
  },

  PORT: {
    MIN_VALUE: 0,
    MAX_VALUE: 65535,
  },

  MONGO_URI: "mongodb://{username}:{password}@{hostname}:{port}/{database}",
} as const;
