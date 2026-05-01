import { z } from "zod";
import { ERole } from "../types/types";

export const UserSchema = z.object({
    fullName: z.string().min(10),
    address: z.string().min(10).max(70),
    contactNumber: z.string().length(13).trim().startsWith("+"),
    email: z.email().trim(),
    password: z.string().min(6).max(12).trim(),
    role: z.nativeEnum(ERole).default(ERole.user)
});

export const UserLoginSchema = z.object({
    contactNumber: z.string().max(13).trim().startsWith("+"),
    password: z.string().max(12).trim(),
});
