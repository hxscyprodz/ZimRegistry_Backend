import * as z from "zod";

export const VUser = z.object({
    phone: z.e164().length(12).trim(),
    lastSessionDate: z.iso.datetime().optional(),
    totalApplications: z.number().min(0).optional()
});