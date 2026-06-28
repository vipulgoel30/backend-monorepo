// third party imports
import z from "zod";

// user imports
import type { TRedisClient } from "../../types/redis.ts";
import { redisTimeCommandDefinition } from "../../config/definitions.ts";
import { NumberZodSchema, ZodHelpers } from "../Zod.ts";
import { ArrayFieldValidationErrors } from "../fieldDefinition/FieldValidationErrorMsgs.ts";
import { RedisCustomError } from "./RedisErrors.ts";
import { Logger } from "../Logger.ts";
import { CustomError } from "../../errors/CustomError.ts";
import { utilsMessages as messages } from "../../config/messages.ts";
import { RedisHelpers } from "./RedisHelpers.ts";
import { formatErrorMessage } from "../../utils.ts";

export class RedisTimeHelper {
  // using IIFE as intermediate variables is required
  // and readonly fields cannot be initialized in
  private static readonly redisTimeCommandZodSchema = (() => {
    const redisTimeCommandValidationErrors = new ArrayFieldValidationErrors({
      fieldDefinition: redisTimeCommandDefinition,
    }).build();

    return z
      .array(
        new NumberZodSchema<typeof redisTimeCommandDefinition.elementsFieldDefinition, string>({
          fieldDefinition: redisTimeCommandDefinition.elementsFieldDefinition,
        }).build(),
        {
          error: (issue) => {
            // if input is not provided and field is required
            if (
              (issue.input === null || issue.input === undefined) &&
              redisTimeCommandDefinition.validations.isRequired
            )
              return redisTimeCommandValidationErrors.required;

            // if value provided is of invalid type
            if (issue.code === "invalid_type") return redisTimeCommandValidationErrors.invalidType;

            // general message of invalid value
            return redisTimeCommandValidationErrors.invalidValue;
          },
        },
      )
      .length(redisTimeCommandDefinition.validations.length!, redisTimeCommandValidationErrors.invalidLength);
  })();

  static async time(client: TRedisClient): Promise<Date> {
    try {
      Logger.logger?.debug(messages.METHOD.LOG_IN);
      // executing redis command to get the time
      // returns value : [unix timestamp in seconds, microseconds elapsed in current second]
      const response: `${number}`[] = await client.time();

      // validating the response received
      const { error, data } = RedisTimeHelper.redisTimeCommandZodSchema.safeParse(response);

      if (error) {
        throw new RedisCustomError(
          RedisHelpers.getInvalidCommandResponseMsg(
            messages.REDIS.COMMANDS.TIME,
            ZodHelpers.parseZodError(error, true),
          ),
        );
      }

      // constructing date from timestamps received
      const dateCalculated: Date = new Date(data[0] * 1000 + data[1] / 1000);

      Logger?.logger?.debug(messages.METHOD.LOG_OUT_SUCCESS);
      return dateCalculated;
    } catch (error) {
      const executionContext: string = RedisHelpers.getRedisCommandExecuteErrorMsg(messages.REDIS.COMMANDS.TIME);

      const finalError =
        error instanceof CustomError
          ? error.addContext(executionContext)
          : new RedisCustomError(formatErrorMessage(executionContext, error), {
              error,
            });

      Logger.logger?.debug(messages.METHOD.LOG_OUT_ERROR);
      throw finalError;
    }
  }
}
