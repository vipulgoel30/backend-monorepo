// Third party imports
import { isPort } from "validator";

// User imports
import { CustomError } from "./errors/CustomError.ts";
import { utilsMessages } from "./config/messages.ts";

export const isPortAsStr = (port: string, field?: string): number => {
  if (!isPort(port)) {
    throw new CustomError(utilsMessages.VALIDATIONS.PORT, { meta: field });
  }

  return parseInt(port);
};
