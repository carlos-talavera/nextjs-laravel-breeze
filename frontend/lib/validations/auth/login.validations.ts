import { z } from "zod";

export const LoginRequest = z.object({
  email: z.coerce
    .string()
    .email()
    .min(1),
  password: z.coerce
    .string()
    .min(1),
  remember: z.coerce
    .boolean()
    .default(false)
});
