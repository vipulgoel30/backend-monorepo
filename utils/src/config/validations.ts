// User imports
import { utilsSettings as settings } from "./settings.ts";

export const utilValidations = {
  portValidation: {
    type: "number",
    minValue: settings.PORT.MIN_VALUE,
    maxValue: settings.PORT.MAX_VALUE,
  },
} as const;

export const mongoValidation = {
  username: {
    field: "Mongo Configuration : Username",
    type: "string",
    isRequired: true,
    isTrim: true,
    minLength: 1,
  },
  password: {
    field: "Mongo Configuration : Password",
    type: "string",
    isRequired: true,
    isTrim: true,
    minLength: 1,
  },
  hostname: {
    field: "Mongo Configuration : Hostname",
    type: "string",
    isRequired: true,
    isTrim: true,
    minLength: 1,
  },
  port: {
    ...utilValidations.portValidation,
    field: "Mongo Configuration : Port",
    isRequired: true,
  },
  database: {
    field: "Mongo Configuration : Database",
    type: "string",
    isRequired: true,
    isTrim: true,
    minLength: 1,
  },
} as const;
