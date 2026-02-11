// Third party imports
import { z } from "zod";

// User imports
import type { FieldValidationMessageType, FieldValidationType } from "../exports.ts";

const createStringZodSchema = (validations: FieldValidationType, messages: FieldValidationMessageType) => {
  let schema = z.string({
    error: (issue) => {
        if(issue.code ==="invalid_type")
    },
  });
};
