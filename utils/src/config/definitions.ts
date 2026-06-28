// User imports
import {
  ArrayFieldDefinition,
  NumberFieldDefinition,
  StringFieldDefinition,
  TFieldDefinitionsUnion,
} from "../classes/fieldDefinition/FieldDefinition.ts";
import {
  ArrayFieldTransformations,
  NumberFieldTransformations,
  StringFieldTransformations,
  TFieldTransformationsUnion,
} from "../classes/fieldDefinition/FieldTransformations.ts";
import {
  ArrayFieldValidations,
  NumberFieldValidations,
  StringFieldValidations,
  TFieldValidationsUnion,
} from "../classes/fieldDefinition/FieldValidations.ts";
import { formatStr } from "../utils.ts";
import { utilsMessages as messages } from "./messages.ts";
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
    validations: utilFieldValidations.port.setField("Mongo Configuration : Port"),
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
export const redisUrlConfigDefinition = {
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
    validations: utilFieldValidations.port.setField("Redis Configuration : Port"),
    transformations: utilFieldTransformations.port,
  }),
} satisfies Record<string, TFieldDefinitionsUnion>;

//////////////////////////////////////////////////
/// REDIS COMMANDS SCHEMAS
//////////////////////////////////////////////////

export const redisTimeCommandDefinition = new ArrayFieldDefinition({
  validations: new ArrayFieldValidations({
    ...ArrayFieldValidations.getDefaultConstructorOptions(),
    field: formatStr(messages.REDIS.COMMAND_RESPONSE_LABEL, {
      command: messages.REDIS.COMMANDS.TIME,
    }),
    isRequired: true,
    length: 2,
  }),
  transformations: new ArrayFieldTransformations({
    ...ArrayFieldTransformations.getDefaultConstructorOptions(),
  }),
  elementsFieldDefinition: new NumberFieldDefinition({
    validations: new NumberFieldValidations({
      ...NumberFieldValidations.getDefaultConstructorOptions(),
      isRequired: true,
      field: "N/A",
    }),
    transformations: new NumberFieldTransformations({
      ...NumberFieldTransformations.getDefaultConstructorOptions(),
      isCoerce: true,
    }),
  }),
});
