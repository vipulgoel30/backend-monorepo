export const utilsMessages = {
  FORMAT_STR_PLACEHOLDER_ERROR: "Placeholder value not defined for :",

  FIELD: {
    REQUIRED: "The '{field}' is required.",
    INVALID_TYPE: "The '{field}' must be of type {type}.",
    INVALID_VALUE: "Invalid value provided for the field '{field}'.",

    STRING: {
      MAX_LENGTH: "The '{field}' must not exceed {maxLength} characters.",
      MIN_LENGTH: "The '{field}' must be at least {minLength} characters long.",
      INVALID_EMAIL: "The '{field}' must be a valid email address.",
      NO_SPACE: "The '{field}' must not contain spaces.",
    },
    NUMBER: {
      MIN_VALUE: "The '{field}' must be at least {minValue}.",
      MAX_VALUE: "The '{field}' must not exceed {maxValue}.",
    },
    ARRAY: {
      INVALID_ARRAY_LENGTH: "The '{field}' must contain exactly {length} items.",
      ARRAY_MIN_LENGTH: "The '{field}' must contain at least {minLength} items.",
      ARRAY_MAX_LENGTH: "The '{field}' must not contain more than {maxLength} items.",
    },
  },

  INVALID_VALIDATIONS: {
    NUMBER_MIN_VALUE: "Invalid minValue configured for field '{field}'. Expected a finite number.",
    NUMBER_MAX_VALUE: "Invalid maxValue configured for field '{field}'. Expected a finite number.",
    NUMBER_MIN_MAX_VALUE_RANGE:
      "Invalid value range configured for field '{field}'. minValue cannot be greater than maxValue.",
    STRING_MIN_LENGTH: "Invalid minLength configured for field '{field}'. Expected a non-negative safe integer.",
    STRING_MAX_LENGTH: "Invalid maxLength configured for field '{field}'. Expected a non-negative safe integer.",
    STRING_LENGTH_RANGE:
      "Invalid length range configured for field '{field}'. minLength cannot be greater than maxLength.",
    ARRAY_LENGTH_WITH_MIN_MAX:
      "Invalid configuration for '{field}': 'length' cannot be used together with 'minLength' or 'maxLength'.",
    ARRAY_MIN_LENGTH: "Invalid minLength configured for '{field}': 'minLength' must be a non-negative number.",
    ARRAY_MAX_LENGTH: "Invalid maxLength configured for '{field}': 'maxLength' must be a non-negative number.",
    ARRAY_LENGTH_RANGE:
      "Invalid length range configured for '{field}': 'minLength' cannot be greater than 'maxLength'.",
  },

  INVALID_TRANFORMATIONS: {
    CONFLICTING_CASE_TRANSFORM:
      "Conflicting case transformation configured for field '{field}'. Cannot apply both lowerCase and upperCase transformations.",
  },

  INVALID_FIELD_DEFINITION: {
    SCOPE: "Invalid field definition",
  },

  VALIDATIONS: {
    PORT: "Invalid '{field}'. Please provide a value between 0 and 65535.",
  },

  MONGO: {
    SCOPE: "MongoDB/Mongoose",
    SCHEMA_ERROR_FORMAT: "Entity : {entity}; Error message : {message}",
    CREATE_MONGO_URI_ERROR: "Failed to create MongoDB connection URI.",
    MONGO_CONNECT_ERROR: "Failed to connect to MongoDB.",
    INDEX_CREATION_ERROR: "Error occurred while creating the index for entity: {entity}.",
    INDEX_CREATION_SUCCESS: "Indexes were created successfully for entity: {entity}.",
  },

  ZOD: {
    SCOPE: "Zod/ZodSchema",
  },

  STATUS: {
    FAIL: "fail",
    ERROR: "error",
  },

  ERROR_FORMAT: "{defaultMessage}; Error : {errorMsg}",
  DEFAULT_ERROR_MESSAGE: "Uhh!!! Something went wrong on the server.",

  REDIS: {
    SCOPE: "Redis",
    CREATE_REDIS_CONNECT_URL_ERROR: "Failed to create Redis connection URL.",
    CREATE_REDIS_CLIENT_ERROR: "Failed to create Redis Client.",
    CLIENT_NOT_FOUND: "Redis client not found.",
    REDIS_COMMAND_ERROR: "Failed to execute redis command: {command}",
    REDIS_COMMAND_RESPONSE: "Redis command response for command: {command}",
    COMMANDS_NAME: {
      HASH: {
        HGET: "hget",
      },
      STRING: {
        SET: "SET",
        GET: "GET",
        GETEX: "GETEX",
      },
      TIME: "TIME",
    },
  },
  METHOD: {
    LOG_IN: "Method /IN",
    LOG_OUT: "Method /OUT",
  },
} as const;
