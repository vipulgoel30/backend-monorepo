// User imports
import { EmailZodSchema, StringZodSchema } from "@mono/utils";
import { fieldValidationsTransformations } from "../../config/validations.js";

const {
  name: { validations: nameValidations, transformations: nameTransformations },
  email: { validations: emailValidations, transformations: emailTransformations },
  password: { validations: passwordValidations },
} = fieldValidationsTransformations.user;

