// User imports
import { CustomError } from "./CustomError.ts";

class InternalServerError<T> extends CustomError<T> {}

export { InternalServerError };
