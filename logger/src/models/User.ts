// Third party imports
import { HydratedDocument, Schema, model } from "mongoose";
import { z } from "zod";
import { hash } from "bcryptjs";

// User imports
import settings from "../config/settings.js";
import { StringMongoSchema, ValidationErrorMsgs, formatStr, utilsMessages } from "@mono/utils";
import { userFieldDefinition } from "../config/definitions.js";
import logger from "../utils/logger.js";

const ENTITY_NAME = settings.ENTITY_NAMES.USER;

interface UserI {
  name: string;
  email: string;
  password: string;
  passwordLastModifiedAt: Date;
  isVerified: boolean;
}

const userSchema = new Schema<UserI>(
  {
    name: new StringMongoSchema(userFieldDefinition.name, ENTITY_NAME).schema,
    email: {
      ...new StringMongoSchema(userFieldDefinition.email, ENTITY_NAME)
        .addCustomValidations((value: string) => z.email().safeParse(value).success, ValidationErrorMsgs.invalidEmail(userFieldDefinition.email.validations.field))
        .schema(),
      index: true,
    },

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

// Event emitted when createIndex for all indexes
// are succcessful for the model
User.on("index", (error) => {
  if (error) logger.error(formatStr(utilsMessages.MONGO.INDEX_CREATION_ERROR, { entity: ENTITY_NAME }), error);
  logger.debug(formatStr(utilsMessages.MONGO.INDEX_CREATION_SUCCESS, { entity: ENTITY_NAME }));
});

export type UserD = HydratedDocument<UserI>;
// export type UserDLean = UserI & { createdAt: Date; updatedAt: Date; _id };

export default User;
