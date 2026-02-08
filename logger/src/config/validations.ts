export default {
  USER: {
    NAME: {
      FIELD: "name",
      IS_TRIM: true,
      REQUIRED: true,
      MIN_LENGTH: 1,
      MAX_LENGTH: 100,
    },
    EMAIL: {
      FIELD: "email",
      REQUIRED: true,
      IS_TRIM: true,
    },
    PASSWORD: {
      FIELD: "password",
      REQUIRED: true,
      MIN_LENGTH: 8,
      MAX_LENGTH: 50,
      IS_PROHIBIT_SPACES: true,
    },
  },
} as const;
