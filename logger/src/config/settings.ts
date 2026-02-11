export default {
  LOG: {
    ROTATE: {
      DATE_PATTERN: "YYYY-MM-DD",
      ZIP_ARCHIEVE: true,
      FILENAME: "logger-%DATE%",
      DIRNAME: "logs",
      MAX_SIZE: "5m", // 5mb
      MAX_FILES: "10d",
      EXTENSION: ".log",
    },
  },

  BCRYPT_HASH_SALT: 10,
} as const;
