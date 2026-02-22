// User imports
const fieldValidations = {
  user: {
    name: {
      field: "name",
      isTrim: true,
      required: true,
      minLength: 1,
      maxLength: 100,
    },
    email: {
      field: "email",
      required: true,
      isTrim: true,
    },
    password: {
      field: "password",
      required: true,
      minLength: 8,
      maxLength: 50,
      isProhibitSpaces: true,
    },
  },
};
