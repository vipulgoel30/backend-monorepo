export default {
  INVALID_LOG_LEVEL: "Invalid log level: '{level}'. Allowed levels are: {allowedLevels}.",

  MONGO: {
    CONNECT_INIT: "Trying to connect to mongo server....",
    CONNECT_SUCCESS: "Successfully connected to mongo server",
  },

  INIT_SERVER: {
    SUCCESS: "Server started at http://{hostname}:{port}",
    ERROR: "Error occured while initializing server.",
    SCOPE: "Init Server",
  },

  
} as const;
