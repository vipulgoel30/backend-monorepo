// Third party imports
import { Schema, model } from "mongoose";
import { z } from "zod";
import { hash } from "bcryptjs";

// User imports
import { fieldValidations } from "../config/validations.js";
import { CreateMongoStringSchema, formatStr, utilsMessages } from "@mono/utils";
import settings from "../config/settings.js";

const ENTITY_NAME = "Users";

const { name: nameValidations, email: emailValidations, password: passwordValidations } = fieldValidations.user;

interface UserI {
  name: string;
  email: string;
  password: string;
  passwordLastModifiedAt: Date;
  isVerified: boolean;
}

const userSchema = new Schema<UserI>(
  {
    name: new CreateMongoStringSchema(nameValidations.field, ENTITY_NAME).aggregateValidations(nameValidations).build(),
    email: new CreateMongoStringSchema(emailValidations.field, ENTITY_NAME)
      .aggregateValidations(emailValidations)
      .validate(
        (value: string) => z.email().safeParse(value).success,
        formatStr(utilsMessages.FIELD.INVALID_EMAIL, { field: emailValidations.field }),
      )
      .build(),

    password: new CreateMongoStringSchema(passwordValidations.field, ENTITY_NAME)
      .aggregateValidations(passwordValidations)
      .validate(
        (value: string) => !value.includes(" "),
        formatStr(utilsMessages.FIELD.NO_SPACE, { field: passwordValidations.field }),
      )
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


// Pre Save 
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
