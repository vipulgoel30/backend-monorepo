// User imports
import type { StringFieldValidationRule } from "@mono/utils";

export const fieldValidations = {
  user: {
    name: {
      type: "string",
      field: "name",
      isTrim: true,
      isRequired: true,
      minLength: 1,
      maxLength: 100,
    } satisfies StringFieldValidationRule<true>,
    email: {
      type: "string",
      field: "email",
      isRequired: true,
      isTrim: true,
    } satisfies StringFieldValidationRule<true>,
    password: {
      type: "string",
      field: "password",
      isRequired: true,
      minLength: 8,
      maxLength: 50,
      isNoSpaces: true,
    } satisfies StringFieldValidationRule<true>,
  },
};
