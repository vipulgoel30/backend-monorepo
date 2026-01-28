// Third party imports
import { Schema, model } from "mongoose";
import z from "zod";

// User imports
import validations from "../config/validations.ts";
import { formatStr, messages } from "@mono/utils";

const { NAME, EMAIL, PASSWORD } = validations.USER;

interface UserI {}

const userSchema = new Schema<UserI>(
  {
    name: {
      type: String,
      required: [NAME.isRequired, formatStr(messages.FIELD.REQUIRED, { field: NAME.field })],
      minLength: [
        NAME.minLength,
        formatStr(messages.FIELD.MIN_LENGTH, { field: NAME.field, minLength: NAME.minLength }),
      ],
      maxLength: [
        NAME.maxLength,
        formatStr(messages.FIELD.MAX_LENGTH, { field: NAME.field, minLength: NAME.maxLength }),
      ],
    },

    email: {
      type: String,
      required: [EMAIL.isRequired, formatStr(messages.FIELD.REQUIRED, { field: EMAIL.field })],
      validate: {
        validator: (value: string) => z.email().safeParse(value).success,
        message: formatStr(messages.FIELD.INVALID_EMAIL, { field: EMAIL.field }),
      },
    },
    password: {
      type: String,
      required: [PASSWORD.isRequired, formatStr(messages.FIELD.REQUIRED, { field: PASSWORD.field })],
      trim: PASSWORD.isTrim,
      minLength: [
        PASSWORD.minLength,
        formatStr(messages.FIELD.MIN_LENGTH, { field: PASSWORD.field, minLength: PASSWORD.minLength }),
      ],
      maxLength: [
        PASSWORD.maxLength,
        formatStr(messages.FIELD.MAX_LENGTH, { field: PASSWORD.field, maxLength: PASSWORD.maxLength }),
      ],
    },
    passwordLastModifiedAt: {
      type: Date,
      default: () => Date.now(),
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

const User = model("Users", userSchema);

export default User;
