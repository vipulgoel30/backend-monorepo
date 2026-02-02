export const messages = {
  FORMAT_STR_PLACEHOLDER_ERROR: "Placeholder value not defined for :",

  FIELD: {
    REQUIRED: "The {field} is required.",
    MAX_LENGTH: "The {field} must not exceed {maxLength} characters.",
    MIN_LENGTH: "The {field} must be at least {minLength} characters long.",
    INVALID_EMAIL: "The {field} must be a valid email address.",
  },

  STATUS: {
    FAIL: "fail",
    ERROR: "error",
  },
} as const;
