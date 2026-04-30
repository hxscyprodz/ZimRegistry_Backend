import { z } from "zod";
import { ERole } from "../types/types";

export const UserSchema = z.object({
    fullName: z.string().min(10),
    address: z.string().min(10).max(70),
    username: z.string().min(6).max(12),
    password: z.string().min(6).max(12),
    role: z.nativeEnum(ERole).default(ERole.user).optional()
})

export type CreateUserSchema = z.infer<typeof UserSchema>;