// User imports
import { messages } from "../config/messages.ts";

export const formatStr = (message: string, placeholder: Record<string, string | number>): string => {
  return message.replace(new RegExp(/\{(\w+)\}/, "g"), (match, key) => {
    if (!(key in placeholder)) {
      throw new Error(`${messages.FORMAT_STR_PLACEHOLDER_ERROR}${key}`);
    }

    return String(placeholder[key]);
  });
};
