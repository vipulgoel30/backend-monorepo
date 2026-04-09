// Third party imports
import type { Request, Response, NextFunction } from "express";

// User imports
import { catchAsync } from "@mono/utils";
import { signupBodyZodSchema, TSignupBody } from "../zod/routes/auth.js";

class AuthController {
  signup = catchAsync(async (req: Request<any, any, TSignupBody>, res: Response, next: NextFunction) => {
    const signupPayload: TSignupBody = signupBodyZodSchema.parse(req.body);

    //1. Checking if user already registered with email
  });
}

export default AuthController;
