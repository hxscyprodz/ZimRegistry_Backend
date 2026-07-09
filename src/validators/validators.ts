import * as z from "zod";

export const VUser = z.object({
  phone: z.e164().length(12).trim(),
  lastSessionDate: z.iso.datetime().optional(),
  totalApplications: z.number().min(0).optional(),
});

export const StaffSchema = z.object({
  phone: z
    .string({ error: "Phone number is required" })
    .trim()
    .e164({ error: "Invalid phone number" })
    .min(13, { message: "Phone number must be at least 13 characters" })
    .max(13, { message: "Phone number must be at most 13 characters" }),
  password: z
    .string({ error: "Password is required" })
    .trim()
    .min(6, { message: "Password must be at least 6 characters" }),
});
