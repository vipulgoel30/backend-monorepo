// user imports
import { utilsMessages as messages } from "../../config/messages.ts";
import { formatErrorMessage, formatStr } from "../../utils.ts";

export class RedisHelpers {
  static getInvalidCommandResponseMsg(command: string, reason: string): string {
    return formatErrorMessage(formatStr(messages.REDIS.INVALID_COMMAND_RESPONSE, { command }), reason);
  }

  static getRedisCommandExecuteErrorMsg(command: string): string {
    return formatStr(messages.REDIS.COMMAND_EXECUTE_ERROR, { command });
  }
}
