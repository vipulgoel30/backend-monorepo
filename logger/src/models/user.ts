// Third party imports
import { Schema, model } from "mongoose";
import { z } from "zod";
import { hash } from "bcryptjs";

// User imports
import { fieldValidationsTransformations } from "../config/validations.js";
import { CreateMongoStringSchema, EmailZodSchema, StringZodSchema, ValidationErrorMsgs } from "@mono/utils";
import settings from "../config/settings.js";

const ENTITY_NAME = "Users";

const {
  name: { validations: nameValidations, transformations: nameTransformations },
  email: { validations: emailValidations, transformations: emailTransformations },
  password: { validations: passwordValidations },
} = fieldValidationsTransformations.user;

export const userZodSchema = {
  name: new StringZodSchema(nameValidations).addTransformations(nameTransformations).build(),
  email: new EmailZodSchema(emailValidations).addTransformations(emailTransformations).build(),
};

interface UserI {
  name: string;
  email: string;
  password: string;
  passwordLastModifiedAt: Date;
  isVerified: boolean;
}

const userSchema = new Schema<UserI>(
  {
    name: new CreateMongoStringSchema(nameValidations.field, ENTITY_NAME).aggregateValidations({ ...nameValidations, ...nameTransformations }).build(),
    email: new CreateMongoStringSchema(emailValidations.field, ENTITY_NAME)
      .aggregateValidations({ ...emailValidations, ...emailTransformations })
      .validate((value: string) => z.email().safeParse(value).success, ValidationErrorMsgs.invalidEmail(emailValidations.field))
      .build(),

    password: new CreateMongoStringSchema(passwordValidations.field, ENTITY_NAME)
      .aggregateValidations({ ...passwordValidations })
      .validate((value: string) => !value.includes(" "), ValidationErrorMsgs.noSpaces(passwordValidations.field))
      .build(),
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

export default User;
