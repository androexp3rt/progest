import { z } from "zod";

export const companyNameValidation = z
  .string()
  .min(4, "Company name must be at least 4 characters")
  .max(30, "Company name can not be more than 30 characters");
export const fullNameValidation = z
  .string()
  .min(2, "Name must be at least 2 characters");

export const emailValidation = z
  .string()
  .email({ message: "Invalid email address" });

export const passwordValidation = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" });

export const signUpValidationSchema = z
  .object({
    companyName: companyNameValidation,
    fullName: fullNameValidation,
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: passwordValidation,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
