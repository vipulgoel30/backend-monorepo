// Third party imports
import { Schema, model } from "mongoose";
import { z } from "zod";
import { hash } from "bcryptjs";

// User imports
import validations from "../config/validations.js";
import { CreateMongoStringSchema, formatStr, utilsMessages } from "@mono/utils";
import settings from "../config/settings.js";

const ENTITY_NAME = "Users";

const { NAME: NAME_VALIDATIONS, EMAIL: EMAIL_VALIDATIONS, PASSWORD: PASSWORD_VALIDATIONS } = validations.USER;

interface UserI {
  name: string;
  email: string;
  password: string;
  passwordLastModifiedAt: Date;
  isVerified: boolean;
}

const userSchema = new Schema<UserI>(
  {
    name: new CreateMongoStringSchema(NAME_VALIDATIONS.FIELD, ENTITY_NAME)
      .aggregateValidations(NAME_VALIDATIONS)
      .build(),
    email: new CreateMongoStringSchema(EMAIL_VALIDATIONS.FIELD, ENTITY_NAME)
      .aggregateValidations(EMAIL_VALIDATIONS)
      .validate(
        (value) => z.email().safeParse(value).success,
        formatStr(utilsMessages.FIELD.INVALID_EMAIL, { field: EMAIL_VALIDATIONS.FIELD }),
      )
      .build(),

    password: new CreateMongoStringSchema(PASSWORD_VALIDATIONS.FIELD, ENTITY_NAME)
      .aggregateValidations(PASSWORD_VALIDATIONS)
      .validate(
        (value) => !value.includes(" "),
        formatStr(utilsMessages.FIELD.NO_SPACES, { field: PASSWORD_VALIDATIONS.FIELD }),
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
