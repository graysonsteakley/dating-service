// @/src/common/validation/auth.ts
import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(12),
});

export const signUpSchema = loginSchema.extend({
  username: z.string(),
  name: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
