// Third party imports
import type { Request, Response, NextFunction } from "express";

// User imports
import { catchAsync } from "@mono/utils";
import { signupBodyZodSchema, TSignupBody } from "../zod/routes/auth.js";
import User, { UserD } from "../models/User.js";
import UserService from "../service/UserService.js";

class AuthController {
  private readonly userService = new UserService();

  signup = catchAsync(async (req: Request<any, any, TSignupBody>, res: Response, next: NextFunction) => {
    const signupPayload: TSignupBody = signupBodyZodSchema.parse(req.body);

    //1. Checking if user already registered with email
    // const existingUser: UserD = await this.userService.getUserByEmail(signupPayload.email);
  });
}

export default AuthController;
