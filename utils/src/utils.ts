// Third party imports
// import { ZodCoercedNumber } from "zod";

// User imports
// import { CustomError } from "./errors/CustomError.ts";
// import { utilTransformations, utilValidations, utilValidations as validations } from "./config/definitions.ts";
import { utilsMessages as messages } from "./config/messages.ts";
// import { NumberZodSchema, ZodHelpers } from "./classes/Zod.ts";
// import { NumberFieldDefinition } from "./classes/FieldDefinition.ts";
import { Primitive } from "./types.ts";

// export function isPortAsStr(port: string, schema: ZodCoercedNumber): number;
// export function isPortAsStr(port: string, field: string): number;
// export function isPortAsStr(port: string, schemaOrField: string | ZodCoercedNumber): number {
//   let schema: ZodCoercedNumber;
//   if (typeof schemaOrField === "string") {
//     const portFieldDefintion = new NumberFieldDefinition(utilValidations.port.setField(schemaOrField).setIsRequired(true), utilTransformations.port.setIsCoerce(false));
//     schema = new NumberZodSchema(portFieldDefintion).build();
//   } else {
//     schema = schemaOrField;
//   }

//   const result = schema.safeParse(port);

//   if (!result.success) {
//     throw new CustomError(ZodHelpers.parseZodError(result.error, true));
//   }

//   return result.data!;
// }

export const formatStr = (message: string, placeholder: Record<string, Primitive>): string => {
  return message.replace(new RegExp(/\{(\w+)\}/, "g"), (_, key) => {
    if (!(key in placeholder)) {
      throw new Error(`${messages.FORMAT_STR_PLACEHOLDER_ERROR}${key}`);
    }

    return String(placeholder[key]);
  });
};

export const getErrMessage = (err: any): string => {
  return err instanceof Error ? err.message : String(err);
};

export const formatErrMessage = (defaultMessage: string, err: any): string => {
  return formatStr(messages.ERROR_FORMAT, { defaultMessage, errorMsg: getErrMessage(err) });
};
