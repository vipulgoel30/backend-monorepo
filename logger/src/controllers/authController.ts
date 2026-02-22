// Third party imports
import type { Request, Response, NextFunction } from "express";

// User imports
import { catchAsync } from "@mono/utils";

class AuthController {
  signup = catchAsync(async (req, res, next) => {});
}
