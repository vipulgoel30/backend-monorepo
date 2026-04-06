// // Third party imports
// import type { SchemaTypeOptions } from "mongoose";

// // User imports
// import { FieldValidationErrorMsg, StringFieldValidationErrorMsg } from "../../types.ts";
// import { FieldDefinition, StringFieldDefinition } from "../../classes/FieldDefinition.ts";
// import { FieldValidations, StringFieldValidations } from "../../classes/FieldValidations.ts";
// import { FieldTransformations, StringFieldTransformations } from "../../classes/FieldTransformations.ts";
// import { createStringFieldValidationErrorMsg } from "./../../classes/FieldValidationErrorMsgs.ts";

// abstract class MongoSchema<
//   TValidations extends FieldValidations,
//   TTransformations extends FieldTransformations,
//   TFieldDefinition extends FieldDefinition<TValidations, TTransformations>,
//   TFieldValidationErrorMsgs extends FieldValidationErrorMsg,
//   SchemaType,
// > {
//   protected _fieldDefinition!: TFieldDefinition;
//   protected _validationMessages?: TFieldValidationErrorMsgs;
//   protected _entity!: string;
//   protected _customValidations: { validator: (value: SchemaType) => boolean; message: string }[];

//   constructor(fieldDefinition: TFieldDefinition, entity: string, validationMessages?: TFieldValidationErrorMsgs) {
//     this.fieldDefinition = fieldDefinition;
//     this.validationMessages = validationMessages;
//     this.entity = entity;
//     this._customValidations = [];
//   }

//   get fieldDefinition(): Readonly<TFieldDefinition> {
//     return this._fieldDefinition;
//   }

//   set fieldDefinition(fieldDefinition: TFieldDefinition) {
//     if (fieldDefinition.isAutoValidate !== true) fieldDefinition.validate();
//     this._fieldDefinition = fieldDefinition;
//   }

//   setFieldDefinition(fieldDefinition: TFieldDefinition) {
//     this.fieldDefinition = fieldDefinition;
//     return this;
//   }

//   get validationMessages(): Readonly<TFieldValidationErrorMsgs | undefined> {
//     return this._validationMessages;
//   }

//   set validationMessages(validationMessages: TFieldValidationErrorMsgs | undefined) {
//     this._validationMessages = validationMessages ? { ...validationMessages } : undefined;
//   }

//   setValidationMessages(validationMessages: TFieldValidationErrorMsgs | undefined) {
//     this.validationMessages = validationMessages;
//     return this;
//   }

//   get entity(): string {
//     return this._entity;
//   }

//   set entity(entity: string) {
//     this._entity = entity;
//   }

//   setEntity(entity: string) {
//     this.entity = entity;
//     return this;
//   }
// }

// export class StringMongoSchema extends MongoSchema<StringFieldValidations, StringFieldTransformations, StringFieldDefinition, StringFieldValidationErrorMsg, String> {
//   constructor(fieldDefinition: StringFieldDefinition, entity: string, validationMessages?: StringFieldValidationErrorMsg) {
//     super(fieldDefinition, entity, validationMessages);
//   }

//   schema(): SchemaTypeOptions<String> {
//     const validationMessages: StringFieldValidationErrorMsg = createStringFieldValidationErrorMsg(this._fieldDefinition, this._validationMessages);
//     const validations: Readonly<StringFieldValidations> = this._fieldDefinition.validations;
//     const transformations: Readonly<StringFieldTransformations> = this._fieldDefinition.transformations;

//     const schema: SchemaTypeOptions<String> = { type: "string" };
//     if (typeof validations.minLength === "number") schema.minLength = [validations.minLength, validationMessages.minLength!];

//     if (typeof validations.maxLength === "number") schema.maxLength = [validations.maxLength, validationMessages.maxLength!];

//     if (this._customValidations.length > 0) {
//       schema.validate = this._customValidations;
//     }

//     if (validations?.isRequired === true) schema.required = [true, validationMessages.required!];

//     if (transformations?.isTrim === true) schema.trim = true;

//     return schema;
//   }
// }
