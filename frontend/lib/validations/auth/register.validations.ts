import { z } from "zod";

export const RegisterRequest = z.object({
    name: z.coerce
      .string()
      .min(1),
    email: z.coerce
      .string()
      .email(),
    password: z.coerce
      .string()
      .min(8)
      .refine((value) => /[a-zA-Z]/.test(value), {
        message: 'Password must contain at least one character.',
      })
      .refine((value) => /[A-Z]/.test(value) && /[a-z]/.test(value), {
        message: 'Password must contain at least one uppercase and lowercase character.'
      })
      .refine((value) => /\d/.test(value), {
        message: 'Password must contain at least one number.'
      })
      .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
        message: 'Password must contain at least one special character.'
      }),
    password_confirmation: z.coerce
      .string()
      .min(8)
}).superRefine(({ password_confirmation, password }, ctx) => {
  if (password_confirmation !== password) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords do not match.",
      path: ["password_confirmation"]
    });
  }
});