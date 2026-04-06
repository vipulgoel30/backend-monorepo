// User imports
import { NumberFieldDefinition, StringFieldDefinition, TFieldDefinitionsUnion } from "../classes/FieldDefinition.ts";
import { NumberFieldTransformations, StringFieldTransformations, TFieldTransformationsUnion } from "../classes/FieldTransformations.ts";
import { NumberFieldValidations, StringFieldValidations, TFieldValidationsUnion } from "../classes/FieldValidations.ts";
import { utilsSettings as settings } from "./settings.ts";

export const utilValidations = {
  port: new NumberFieldValidations("port", {
    isRequired: true,
    minValue: settings.PORT.MIN_VALUE,
    maxValue: settings.PORT.MAX_VALUE,
  }),
} satisfies Record<string, TFieldValidationsUnion>;

export const utilTransformations = {
  port: new NumberFieldTransformations({
    isCoerce: true,
  }),
} satisfies Record<string, TFieldTransformationsUnion>;

export const mongoFieldDefinitions = {
  username: new StringFieldDefinition(
    new StringFieldValidations("Mongo Configuration : Username", {
      ...StringFieldValidations.getDefaultConstructorOptions(),
      isRequired: true,
      minLength: 1,
    }),
    new StringFieldTransformations({
      ...StringFieldTransformations.getDefaultConstructorOptions(),
      isTrim: true,
    }),
  ),
  password: new StringFieldDefinition(
    new StringFieldValidations("Mongo Configuration : Password", {
      ...StringFieldValidations.getDefaultConstructorOptions(),
      isRequired: true,
      minLength: 1,
    }),
    new StringFieldTransformations({
      ...StringFieldTransformations.getDefaultConstructorOptions(),
      isTrim: true,
    }),
  ),
  hostname: new StringFieldDefinition(
    new StringFieldValidations("Mongo Configuration : Hostname", {
      ...StringFieldValidations.getDefaultConstructorOptions(),
      isRequired: true,
      minLength: 1,
    }),
    new StringFieldTransformations({
      ...StringFieldTransformations.getDefaultConstructorOptions(),
      isTrim: true,
    }),
  ),
  port: new NumberFieldDefinition(utilValidations.port.setField("Mongo Configuration : Port").setIsRequired(true), utilTransformations.port.setIsCoerce(false)),

  database: new StringFieldDefinition(
    new StringFieldValidations("Mongo Configuration : Database", {
      ...StringFieldValidations.getDefaultConstructorOptions(),
      isRequired: true,
      minLength: 1,
    }),
    new StringFieldTransformations({ ...StringFieldTransformations.getDefaultConstructorOptions(), isTrim: true }),
  ),
} satisfies Record<string, TFieldDefinitionsUnion>;
