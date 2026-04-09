import z from "zod";
import userZodSchema from "../models/user.js";

export const signupBodyZodSchema = z.object({
  name: userZodSchema.name,
  email: userZodSchema.email,
  password: userZodSchema.password,
  confirmPassword: userZodSchema.confirmPassword,
});

export type TSignupBody = z.infer<typeof signupBodyZodSchema>;
