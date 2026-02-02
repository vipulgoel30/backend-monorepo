// User imports
import { CustomError } from "./CustomError.ts";

class AppError<T> extends CustomError<T> {}

export { AppError };
