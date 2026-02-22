export const utilsMessages = {
  FORMAT_STR_PLACEHOLDER_ERROR: "Placeholder value not defined for :",

  FIELD: {
    REQUIRED: "The '{field}' is required.",
    MAX_LENGTH: "The '{field}' must not exceed {maxLength} characters.",
    MIN_LENGTH: "The '{field}' must be at least {minLength} characters long.",
    INVALID_EMAIL: "The '{field}' must be a valid email address.",
    NO_SPACE: "The '{field}' must not contain spaces.",
    INVALID_TYPE: "The '{field}' must be of type {type}.",
    MIN_VALUE: "The '{field}' must be at least {minValue}.",
    MAX_VALUE: "The '{field}' must not exceed {maxValue}.",
    INVALID_VALUE: "Invalid value provided for the field '{field}'.",
  },

  INVALID_VALIDATION: {
    MIN_LENGTH: "Invalid minLength value configured for field '{field}'. Expected a non-negative number.",
    MAX_LENGTH: "Invalid maxLength value configured for field '{field}'. Expected a non-negative number.",
    LENGTH_RANGE: "Invalid length range configured for field '{field}'. minLength cannot be greater than maxLength.",
    CONFLICTING_CASE_TRANSFORM:
      "Conflicting case transformation configured for field '{field}'. Cannot apply both lowerCase and upperCase transformations.",
    MIN_MAX_VALUE_RANGE:
      "Invalid value range configured for field '{field}'. minValue cannot be greater than maxValue.",
  },

  VALIDATIONS: {
    PORT: "Invalid port number. Please provide a value between 0 and 65535.",
  },

  MONGO_ERROR: {
    FORMAT: "{prefix}; Entity : {entity}; Message : {message}",
    PREFIX: "MongoDB Error",
  },

  // MONGO_EVENT: {},

  STATUS: {
    FAIL: "fail",
    ERROR: "error",
  },

  ERROR: "Error : ",
} as const;
