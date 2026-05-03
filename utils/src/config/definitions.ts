// User imports
import { NumberFieldDefinition, StringFieldDefinition, TFieldDefinitionsUnion } from "../classes/FieldDefinition.ts";
import { NumberFieldTransformations, StringFieldTransformations, TFieldTransformationsUnion } from "../classes/FieldTransformations.ts";
import { NumberFieldValidations, StringFieldValidations, TFieldValidationsUnion } from "../classes/FieldValidations.ts";
import { utilsSettings as settings } from "./settings.ts";

////////////////////////////////////////////////////////
/////////   Util Field Validations
////////////////////////////////////////////////////////
export const utilFieldValidations = {
  port: new NumberFieldValidations("port", {
    isRequired: true,
    minValue: settings.PORT.MIN_VALUE,
    maxValue: settings.PORT.MAX_VALUE,
  }),
} satisfies Record<string, TFieldValidationsUnion>;

////////////////////////////////////////////////////////
/////////   Util Field Transformations
////////////////////////////////////////////////////////
export const utilFieldTransformations = {
  port: new NumberFieldTransformations({
    isCoerce: true,
  }),
} satisfies Record<string, TFieldTransformationsUnion>;

////////////////////////////////////////////////////////
/////////   Util Field Definition
////////////////////////////////////////////////////////

//////////////////////////////////////////////////
/// MONGO URL CONFIGURATION FIELD DEFINITIONS
//////////////////////////////////////////////////
export const mongoUriConfigurationFieldDefinitions = {
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
  port: new NumberFieldDefinition(utilFieldValidations.port.setField("Mongo Configuration : Port"), utilFieldTransformations.port),

  database: new StringFieldDefinition(
    new StringFieldValidations("Mongo Configuration : Database", {
      ...StringFieldValidations.getDefaultConstructorOptions(),
      isRequired: true,
      minLength: 1,
    }),
    new StringFieldTransformations({ ...StringFieldTransformations.getDefaultConstructorOptions(), isTrim: true }),
  ),
} satisfies Record<string, TFieldDefinitionsUnion>;

//////////////////////////////////////////////////
/// REDIS URL CONFIGURATION FIELD DEFINITIONS
//////////////////////////////////////////////////
export const redisUrlConfigurationFieldDefinitions = {
  username: new StringFieldDefinition(
    new StringFieldValidations("Redis Configuration : Username", {
      ...StringFieldValidations.getDefaultConstructorOptions(),
      isRequired: true,
      minLength: 1,
    }),
    new StringFieldTransformations({ ...StringFieldTransformations.getDefaultConstructorOptions(), isTrim: true }),
  ),
  password: new StringFieldDefinition(
    new StringFieldValidations("Redis Configuration : Password", {
      ...StringFieldValidations.getDefaultConstructorOptions(),
      isRequired: true,
      minLength: 1,
    }),
    new StringFieldTransformations({ ...StringFieldTransformations.getDefaultConstructorOptions(), isTrim: true }),
  ),
  hostname: new StringFieldDefinition(
    new StringFieldValidations("Redis Configuration : Hostname", {
      ...StringFieldValidations.getDefaultConstructorOptions(),
      isRequired: true,
      minLength: 1,
    }),
    new StringFieldTransformations({ ...StringFieldTransformations.getDefaultConstructorOptions(), isTrim: true }),
  ),
  port: new NumberFieldDefinition(utilFieldValidations.port.setField("Redis Configuration : Port"), utilFieldTransformations.port),
};
