// // Third party imports
// import { z } from "zod";
// import { connect, type ConnectOptions, type Mongoose } from "mongoose";

// // User imports
// import { type retryAsyncWrapper } from "../retryAsync.ts";
// import { mongoValidation } from "../../config/definitions.ts";
// import { CustomError, type CustomErrorInfo } from "../../errors/CustomError.ts";
// import { utilsSettings as settings } from "../../config/settings.ts";
// import { utilsMessages as messages } from "./../../config/messages.ts";
// import { NumberZodSchema, StringZodSchema, ZodHelpers } from "./../../classes/Zod.ts";
// import { formatStr } from "../../utils.ts";

// export class MongoError extends CustomError {
//   constructor(message: string, info?: Omit<CustomErrorInfo, "scope">) {
//     super(message, { scope: messages.MONGO.SCOPE, ...info });
//   }
// }

// export interface CreateMongoUriConfig {
//   hostname: string;
//   port: string;
//   username: string;
//   password: string;
//   database: string;
// }

// const createMongoUriZodSchema = z.object({
//   hostname: new StringZodSchema(mongoValidation.hostname).build(),
//   port: new NumberZodSchema(mongoValidation.port).build(),
//   username: new StringZodSchema(mongoValidation.username).build(),
//   password: new StringZodSchema(mongoValidation.password).build(),
//   database: new StringZodSchema(mongoValidation.database).build(),
// });

// export const createMongoUri = (options: CreateMongoUriConfig) => {
//   try {
//     const result = createMongoUriZodSchema.safeParse(options);
//     if (!result.success) {
//       throw new Error(ZodHelpers.parseZodError(result.error, true));
//     }

//     return formatStr(settings.MONGO_URI, result.data);
//   } catch (error) {
//     throw new MongoError(messages.MONGO.CREATE_MONGO_URI_ERROR, { error });
//   }
// };

// export const mongoConnect = async (uri: string, retryAsync: ReturnType<typeof retryAsyncWrapper>, options?: ConnectOptions): Promise<Mongoose> => {
//   try {
//     const mongoose = await retryAsync(() => connect(uri, { ...options, authSource: "admin" }));
//     return mongoose;
//   } catch (error) {
//     throw new MongoError(messages.MONGO.MONGO_CONNECT_ERROR, { error });
//   }
// };
