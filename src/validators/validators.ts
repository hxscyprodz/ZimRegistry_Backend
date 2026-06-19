import * as z from "zod";

export const VUser = z.object({
    phoneNumber: z.e164().length(12).trim(),
    lastSession: z.iso.datetime().optional(),
    totalApplications: z.number().min(0).optional()
});