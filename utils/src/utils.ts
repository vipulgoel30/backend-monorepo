// Third party imports
import validator from "validator";

// User imports
import { CustomError } from "./errors/CustomError.ts";
import { utilsMessages as messages } from "./config/messages.ts";

export const isPortAsStr = (port: string, field?: string): number => {
  if (!validator.isPort(port)) {
    throw new CustomError(messages.VALIDATIONS.PORT, { meta: field });
  }

  return parseInt(port);
};

