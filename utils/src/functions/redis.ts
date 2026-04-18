// Third party imports
import z from "zod";

// User imports
import { CustomError, type CustomErrorInfo } from "../errors/CustomError.ts";
import { utilsMessages as messages } from "../config/messages.ts";
import { NumberZodSchema, StringZodSchema } from "../classes/Zod.ts";
import { redisUrlConfigurationFieldDefinitions } from "../config/definitions.ts";

export class RedisError extends CustomError {
  constructor(message: string, info: Exclude<CustomErrorInfo, "scope">) {
    super(message, { ...info, scope: messages.REDIS.SCOPE });
  }
}

export interface RedisConnectUrlConfig {
  username: string;
  password: string;
  hostname: string;
  port: string;
}

const createRedisConnnectUrlZodSchema = z.object({
  username: new StringZodSchema(redisUrlConfigurationFieldDefinitions.username).build(),
  password: new StringZodSchema(redisUrlConfigurationFieldDefinitions.password).build(),
  hostname: new StringZodSchema(redisUrlConfigurationFieldDefinitions.hostname).build(),
  port: new NumberZodSchema(redisUrlConfigurationFieldDefinitions.port).build(),
});

export const createRedisConnectUrl = (options: RedisConnectUrlConfig): string => {
  try {
    const result = createRedisConnnectUrlZodSchema.safeParse(options);
    if (!result.success) {
    }
    return "";
  } catch (error) {
    throw error;
  }
};
