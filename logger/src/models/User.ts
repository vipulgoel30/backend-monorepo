// Third party imports
import { HydratedDocument, InferRawDocType, Schema, model } from "mongoose";
import { z } from "zod";
import { hash } from "bcryptjs";

// User imports
import settings from "../config/settings.js";
import { StringMongoSchema, ValidationErrorMsgs } from "@mono/utils";
import { userFieldDefinition } from "../config/definitions.js";

const ENTITY_NAME = settings.ENTITY_NAMES.USER;

export interface UserI {
  name: string;
  email: string;
  password: string;
  passwordLastModifiedAt: Date;
  isVerified: boolean;
}

const userSchema = new Schema<UserI>(
  {
    name: new StringMongoSchema(userFieldDefinition.name, ENTITY_NAME).schema,
    email: new StringMongoSchema(userFieldDefinition.email, ENTITY_NAME)
      .addCustomValidations((value: string) => z.email().safeParse(value).success, ValidationErrorMsgs.invalidEmail(userFieldDefinition.email.validations.field))
      .schema(),

    password: new StringMongoSchema(userFieldDefinition.password, ENTITY_NAME)
      .addCustomValidations((value: string) => !value.includes(" "), ValidationErrorMsgs.noSpaces(userFieldDefinition.password.validations.field))
      .schema(),
    passwordLastModifiedAt: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

// Pre save document middleware hook
userSchema.pre("save", async function () {
  // Checking if the document is the newly created document
  // or password field is modified
  if (this.isNew || this.isModified("password")) {
    this.passwordLastModifiedAt = new Date();
    this.password = await hash(this.password, settings.BCRYPT_HASH_SALT); // hashing the password
  }
});

const User = model(ENTITY_NAME, userSchema);

export type UserD = HydratedDocument<UserI>;

export default User;
