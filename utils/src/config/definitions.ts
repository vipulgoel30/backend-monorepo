// User imports
import {
  NumberFieldDefinition,
  StringFieldDefinition,
  TFieldDefinitionsUnion,
} from "../classes/FieldDefinition.ts";
import {
  NumberFieldTransformations,
  StringFieldTransformations,
  TFieldTransformationsUnion,
} from "../classes/FieldTransformations.ts";
import {
  NumberFieldValidations,
  StringFieldValidations,
  TFieldValidationsUnion,
} from "../classes/FieldValidations.ts";
import { utilsSettings as settings } from "./settings.ts";

////////////////////////////////////////////////////////
/////////   Util Field Validations
////////////////////////////////////////////////////////
export const utilFieldValidations = {
  port: new NumberFieldValidations({
    ...NumberFieldValidations.getDefaultConstructorOptions(),
    field: "port",
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
    ...NumberFieldTransformations.getDefaultConstructorOptions(),
    isCoerce: true,
  }),
} satisfies Record<string, TFieldTransformationsUnion>;

//////////////////////////////////////////////////
/// MONGO URL CONFIGURATION FIELD DEFINITIONS
//////////////////////////////////////////////////
export const mongoUriConfigurationFieldDefinitions = {
  username: new StringFieldDefinition({
    validations: new StringFieldValidations({
      ...StringFieldValidations.getDefaultConstructorOptions(),
      field: "Mongo Configuration : Username",
      isRequired: true,
      minLength: 1,
    }),
    transformations: new StringFieldTransformations({
      ...StringFieldTransformations.getDefaultConstructorOptions(),
      isTrim: true,
    }),
  }),
  password: new StringFieldDefinition({
    validations: new StringFieldValidations({
      ...StringFieldValidations.getDefaultConstructorOptions(),
      field: "Mongo Configuration : Password",
      isRequired: true,
      minLength: 1,
    }),
    transformations: new StringFieldTransformations({
      ...StringFieldTransformations.getDefaultConstructorOptions(),
      isTrim: true,
    }),
  }),
  hostname: new StringFieldDefinition({
    validations: new StringFieldValidations({
      ...StringFieldValidations.getDefaultConstructorOptions(),
      field: "Mongo Configuration : Hostname",
      isRequired: true,
      minLength: 1,
    }),
    transformations: new StringFieldTransformations({
      ...StringFieldTransformations.getDefaultConstructorOptions(),
      isTrim: true,
    }),
  }),
  port: new NumberFieldDefinition({
    validations: utilFieldValidations.port.setField(
      "Mongo Configuration : Port",
    ),
    transformations: utilFieldTransformations.port,
  }),

  database: new StringFieldDefinition({
    validations: new StringFieldValidations({
      ...StringFieldValidations.getDefaultConstructorOptions(),
      field: "Mongo Configuration : Database",
      isRequired: true,
      minLength: 1,
    }),
    transformations: new StringFieldTransformations({
      ...StringFieldTransformations.getDefaultConstructorOptions(),
      isTrim: true,
    }),
  }),
} satisfies Record<string, TFieldDefinitionsUnion>;

//////////////////////////////////////////////////
/// REDIS URL CONFIGURATION FIELD DEFINITIONS
//////////////////////////////////////////////////
export const redisUrlConfigurationFieldDefinitions = {
  username: new StringFieldDefinition({
    validations: new StringFieldValidations({
      ...StringFieldValidations.getDefaultConstructorOptions(),
      field: "Redis Configuration : Username",
      isRequired: true,
      minLength: 1,
    }),
    transformations: new StringFieldTransformations({
      ...StringFieldTransformations.getDefaultConstructorOptions(),
      isTrim: true,
    }),
  }),
  password: new StringFieldDefinition({
    validations: new StringFieldValidations({
      ...StringFieldValidations.getDefaultConstructorOptions(),
      field: "Redis Configuration : Password",
      isRequired: true,
      minLength: 1,
    }),
    transformations: new StringFieldTransformations({
      ...StringFieldTransformations.getDefaultConstructorOptions(),
      isTrim: true,
    }),
  }),
  hostname: new StringFieldDefinition({
    validations: new StringFieldValidations({
      ...StringFieldValidations.getDefaultConstructorOptions(),
      field: "Redis Configuration : Hostname",
      isRequired: true,
      minLength: 1,
    }),
    transformations: new StringFieldTransformations({
      ...StringFieldTransformations.getDefaultConstructorOptions(),
      isTrim: true,
    }),
  }),
  port: new NumberFieldDefinition({
    validations: utilFieldValidations.port.setField(
      "Redis Configuration : Port",
    ),
    transformations: utilFieldTransformations.port,
  }),
} satisfies Record<string, TFieldDefinitionsUnion>;
