// Third party imports
import { Schema, SchemaTypeOptions } from "mongoose";

// User imports
import { formatStr } from "../formatStr.ts";
import { utilsMessages as messages } from "../../config/messages.ts";
import { CustomError } from "../../errors/CustomError.ts";

class CreateMongoSchema<T> {
  schema: SchemaTypeOptions<T>;

  constructor(
    protected readonly field: string,
    protected readonly entity: string,
    type: SchemaTypeOptions<T>["type"],
  ) {
    this.schema = { type };
  }

  protected formatSchemaErr(message: string) {
    return formatStr(messages.MONGO_ERROR.SCHEMA_ERROR_FORMAT, {
      entity: this.entity,
      message,
    });
  }

  required(isRequired?: boolean) {
    if (isRequired === true)
      this.schema.required = [true, this.formatSchemaErr(formatStr(messages.FIELD.REQUIRED, { field: this.field }))];
    return this;
  }

  validate(validationFn: (value: T) => boolean, message: string) {
    this.schema.validate = {
      validator: validationFn,
      message: this.formatSchemaErr(message),
    };

    return this;
  }

  build(): SchemaTypeOptions<T> {
    return this.schema;
  }
}

export class CreateMongoStringSchema extends CreateMongoSchema<string> {
  constructor(field: string, entity: string) {
    super(field, entity, Schema.Types.String);
  }

  trim(isTrim?: boolean) {
    if (isTrim === true) this.schema.trim = true;
    return this;
  }

  minLength(minLength?: number) {
    if (typeof minLength === "number") {
      // Checking if in-length is valid or not
      if (minLength < 0) {
        throw new CustomError(
          this.formatSchemaErr(formatStr(messages.INVALID_VALIDATION.MAX_LENGTH, { field: this.field })),
          {
            minLength,
          },
        );
      }

      this.schema.minlength = [
        minLength,
        this.formatSchemaErr(formatStr(messages.FIELD.MIN_LENGTH, { field: this.field, minLength: minLength })),
      ];
    }

    return this;
  }

  maxLength(maxLength?: number) {
    if (typeof maxLength === "number") {
      // Checking if max-length is valid or not
      if (maxLength < 0) {
        throw new CustomError(
          this.formatSchemaErr(formatStr(messages.INVALID_VALIDATION.MAX_LENGTH, { field: this.field })),
          { maxLength },
        );
      }

      this.schema.maxlength = [
        maxLength,
        this.formatSchemaErr(formatStr(messages.FIELD.MAX_LENGTH, { field: this.field, maxLength: maxLength })),
      ];
    }

    return this;
  }

  aggregateValidations(options: { isTrim?: boolean; required?: boolean; minLength?: number; maxLength?: number }) {
    this.trim(options.isTrim);
    this.required(options.required);
    this.minLength(options.minLength);
    this.maxLength(options.maxLength);
    return this;
  }
}
