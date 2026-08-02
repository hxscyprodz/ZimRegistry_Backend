import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(12),
});

export const registerSchema = z.object({
  firstName: z.string().min(2).max(50),
  middleNames: z.string().min(2).max(100).optional(),
  surname: z.string().min(2).max(50),
  nationalIdNumber: z.string().min(15).max(15),
  phoneNumber: z.e164(),
  email: z.string().email(),
  password: z.string().min(8).max(12),
  confirmPassword: z.string().min(8).max(12),
});

export const nationalIdApplicationSchema = z.object({
  stationId: z.uuid(),
  nationalIdNumber: z.string().min(15).max(15),
  contactNumber: z.e164(),
})