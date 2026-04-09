// User imports

import { StringFieldDefinition, StringFieldTransformations, StringFieldValidations, type TFieldDefinitionsUnion } from "@mono/utils";

const utilValidations = {
  password: new StringFieldValidations("Password", {
    ...StringFieldValidations.getDefaultConstructorOptions(),
    isRequired: true,
    minLength: 8,
    maxLength: 50,
    isNoSpaces: true,
  }),
};

const utilTransformations = {
  password: new StringFieldTransformations({
    ...StringFieldTransformations.getDefaultConstructorOptions(),
  }),
};

export const userFieldDefinition = {
  name: new StringFieldDefinition(
    new StringFieldValidations("Name", {
      ...StringFieldValidations.getDefaultConstructorOptions(),
      isRequired: true,
      minLength: 1,
      maxLength: 100,
    }),
    new StringFieldTransformations({ ...StringFieldTransformations.getDefaultConstructorOptions(), isTrim: true }),
  ),
  email: new StringFieldDefinition(
    new StringFieldValidations("Email", {
      ...StringFieldValidations.getDefaultConstructorOptions(),
      isRequired: true,
      isEmail: true,
    }),
    new StringFieldTransformations({ ...StringFieldTransformations.getDefaultConstructorOptions(), isTrim: true, isToLowerCase: true }),
  ),
  password: new StringFieldDefinition(utilValidations.password.setField("Password"), utilTransformations.password),
  confirmPassword: new StringFieldDefinition(utilValidations.password.setField("Confirm Password"), utilTransformations.password),
} satisfies Record<string, TFieldDefinitionsUnion>;
