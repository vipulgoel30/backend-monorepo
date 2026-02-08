// Third party imports
import { Schema, SchemaTypeOptions, connect, connection, type ConnectOptions } from "mongoose";

// User imports
import { formatStr } from "./formatStr.ts";
import { utilsMessages as messages } from "../exports.ts";
import { type retryAsyncWrapper } from "./retryAsync.ts";
// import { formatStr, utilsMessages as messages, type retryAsyncWrapper } from "../exports.ts";

const mongoConnect = async (
  uri: string,
  retryAsync: ReturnType<typeof retryAsyncWrapper>,
  options?: ConnectOptions,
) => {
  await retryAsync(async () => await connect(uri, options));
  connection.on("connected", () => console.log());
  connection.on("error", (error) => {});
  connection.on("disconnected", () => {});
  connection.on("disconnecting", () => {});
  connection.on("disconnected", () => console.log("disconnected"));
};

class CreateMongoSchema<T> {
  schema: SchemaTypeOptions<T>;
  constructor(
    protected readonly field: string,
    protected readonly entity: string,
    type: SchemaTypeOptions<T>["type"],
  ) {
    this.schema = { type };
  }

  protected formatErr(message: string) {
    return formatStr(messages.MONGO_ERROR.FORMAT, {
      prefix: messages.MONGO_ERROR.PREFIX,
      entity: this.entity,
      message,
    });
  }

  required(isRequired?: boolean) {
    if (isRequired === true)
      this.schema.required = [true, this.formatErr(formatStr(messages.FIELD.REQUIRED, { field: this.field }))];
    return this;
  }

  validate(validationFn: (value: T) => boolean, message: string) {
    this.schema.validate = {
      validator: validationFn,
      message: this.formatErr(message),
    };

    return this;
  }

  build(): SchemaTypeOptions<T> {
    return this.schema;
  }
}

class CreateMongoStringSchema extends CreateMongoSchema<string> {
  constructor(field: string, entity: string) {
    super(field, entity, Schema.Types.String);
  }

  trim(isTrim?: boolean) {
    if (isTrim === true) this.schema.trim = true;
    return this;
  }

  minlength(minlength?: number) {
    if (typeof minlength === "number")
      this.schema.minlength = [
        minlength,
        this.formatErr(formatStr(messages.FIELD.MIN_LENGTH, { field: this.field, minLength: minlength })),
      ];

    return this;
  }

  maxlength(maxlength?: number) {
    if (typeof maxlength === "number")
      this.schema.maxlength = [
        maxlength,
        this.formatErr(formatStr(messages.FIELD.MAX_LENGTH, { field: this.field, maxLength: maxlength })),
      ];

    return this;
  }

  aggregateValidations(options: { IS_TRIM?: boolean; REQUIRED?: boolean; MIN_LENGTH?: number; MAX_LENGTH?: number }) {
    this.trim(options.IS_TRIM);
    this.required(options.REQUIRED);
    this.minlength(options.MIN_LENGTH);
    this.maxlength(options.MAX_LENGTH);
    return this;
  }
}

export { mongoConnect, CreateMongoStringSchema };
