// Third party imports
import type { SchemaTypeOptions } from "mongoose";

// User imports
import { FieldValidationErrorMsg, StringFieldValidationErrorMsg } from "../types.ts";
import { FieldDefinition, StringFieldDefinition } from "./FieldDefinition.ts";
import { createStringFieldValidationErrorMsg } from "./FieldValidationErrorMsgs.ts";
import { FieldValidations, StringFieldValidations } from "./FieldValidations.ts";
import { FieldTransformations, StringFieldTransformations } from "./FieldTransformations.ts";

abstract class MongoSchema<
  TFieldDefinition extends FieldDefinition<FieldValidations<any>, FieldTransformations>,
  TFieldValidationErrorMsgs extends FieldValidationErrorMsg,
  SchemaType,
> {
  protected _fieldDefinition!: TFieldDefinition;
  protected _validationMessages?: TFieldValidationErrorMsgs;
  protected _entity!: string;
  protected _customValidations: { validator: (value: SchemaType) => boolean; message: string }[];

  constructor(fieldDefinition: TFieldDefinition, entity: string, validationMessages?: TFieldValidationErrorMsgs) {
    this.fieldDefinition = fieldDefinition;
    this.validationMessages = validationMessages;
    this.entity = entity;
    this._customValidations = [];
  }

  get fieldDefinition(): Readonly<TFieldDefinition> {
    return this._fieldDefinition;
  }

  set fieldDefinition(fieldDefinition: TFieldDefinition) {
    if (fieldDefinition.isAutoValidate !== true) fieldDefinition.validate();
    this._fieldDefinition = fieldDefinition;
  }

  setFieldDefinition(fieldDefinition: TFieldDefinition) {
    this.fieldDefinition = fieldDefinition;
    return this;
  }

  get validationMessages(): Readonly<TFieldValidationErrorMsgs | undefined> {
    return this._validationMessages;
  }

  set validationMessages(validationMessages: TFieldValidationErrorMsgs | undefined) {
    this._validationMessages = validationMessages ? { ...validationMessages } : undefined;
  }

  setValidationMessages(validationMessages: TFieldValidationErrorMsgs | undefined) {
    this.validationMessages = validationMessages;
    return this;
  }

  addCustomValidations(validationFn: (value: SchemaType) => boolean, message: string) {
    this._customValidations.push({
      validator: validationFn,
      message,
    });

    return this;
  }

  get entity(): string {
    return this._entity;
  }

  set entity(entity: string) {
    this._entity = entity;
  }

  setEntity(entity: string) {
    this.entity = entity;
    return this;
  }
}

export class StringMongoSchema<
  TFieldDefinition extends StringFieldDefinition<StringFieldValidations<any, any, any>, StringFieldTransformations<any, any, any>>,
> extends MongoSchema<TFieldDefinition, StringFieldValidationErrorMsg, string> {
  constructor(fieldDefinition: TFieldDefinition, entity: string, validationMessages?: StringFieldValidationErrorMsg) {
    super(fieldDefinition, entity, validationMessages);
  }

  schema(): SchemaTypeOptions<string> {
    const validationMessages: StringFieldValidationErrorMsg = createStringFieldValidationErrorMsg(this._fieldDefinition, this._validationMessages);
    const validations: Readonly<TFieldDefinition["validations"]> = this._fieldDefinition.validations;
    const transformations: Readonly<TFieldDefinition["transformations"]> = this._fieldDefinition.transformations;

    const schema: SchemaTypeOptions<string> = { type: "string" };
    if (typeof validations.minLength === "number") schema.minLength = [validations.minLength, validationMessages.minLength!];

    if (typeof validations.maxLength === "number") schema.maxLength = [validations.maxLength, validationMessages.maxLength!];

    if (this._customValidations.length > 0) {
      schema.validate = this._customValidations;
    }

    if (validations?.isRequired === true) schema.required = [true, validationMessages.required!];

    if (transformations?.isTrim === true) schema.trim = true;

    return schema;
  }
}
