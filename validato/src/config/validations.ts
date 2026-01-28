export default {
  USER: {
    NAME: {
      type: String,
      field: "name",
      minLength: 1,
      maxLength: 100,
      isTrim: true,
      isRequired: true,
    },

    EMAIL: {
      type: String,
      field: "email",
      isRequired: true,
    },

    PASSWORD: {
      type: String,
      field: "password",
      isRequired: true,
      isTrim: true,
      minLength: 8,
      maxLength: 50,
    },
  },
} as const;
