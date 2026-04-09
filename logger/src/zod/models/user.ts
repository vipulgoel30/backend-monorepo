import { StringZodSchema } from "@mono/utils";
import { userFieldDefinition } from "../../config/definitions.js";

const userZodSchema = {
  name: new StringZodSchema(userFieldDefinition.name).build(),
  email: new StringZodSchema(userFieldDefinition.email).build(),
  password: new StringZodSchema(userFieldDefinition.password).build(),
  confirmPassword: new StringZodSchema(userFieldDefinition.confirmPassword).build(),
};

export default userZodSchema;
