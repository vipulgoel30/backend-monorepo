export const utilsMessages = {
  FORMAT_STR_PLACEHOLDER_ERROR: "Placeholder value not defined for :",

  FIELD: {
    REQUIRED: "The '{field}' is required.",
    MAX_LENGTH: "The '{field}' must not exceed {maxLength} characters.",
    MIN_LENGTH: "The '{field}' must be at least {minLength} characters long.",
    INVALID_EMAIL: "The '{field}' must be a valid email address.",
    NO_SPACES: "The '{field}' must not contain spaces.",
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
