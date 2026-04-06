// User imports
import { FieldTypes, type FieldValidationTransformation } from "@mono/utils";

export const fieldValidationsTransformations = {
  user: {
    name: {
      validations: {
        type: FieldTypes.string,
        field: "Name",
        isRequired: true,
        minLength: 1,
        maxLength: 100,
      },
      transformations: {
        isTrim: true,
      },
    } satisfies FieldValidationTransformation<true, FieldTypes.string>,
    email: {
      validations: {
        type: FieldTypes.email,
        field: "Email",
        isRequired: true,
      },
      transformations: {
        isTrim: true,
        isToLowerCase: true,
      },
    } satisfies FieldValidationTransformation<true, FieldTypes.email>,
    password: {
      validations: {
        type: FieldTypes.string,
        field: "Password",
        isRequired: true,
        minLength: 8,
        maxLength: 50,
        isNoSpaces: true,
      },
      transformations: {},
    } satisfies FieldValidationTransformation<true, FieldTypes.string>,
    confirmPassword: {
      validations: {
        field: "Confirm Password",
      },
    },
  },
} as const;
