import z from "zod";

export const VUser = z.object({
  phone: z.e164().length(12).trim(),
  lastSessionDate: z.iso.datetime().optional(),
  totalApplications: z.number().min(0).optional(),
});


export const BaseApplication = z.object({
  applicationType: z.enum(["birth", "national-id"]),
  applicationId: z.string(),
  stationId: z.string().uuid(),
  phone: z.e164().length(13).trim(),
  approvedBy: z.string().optional(),
  approvedDate: z.date().optional(),
  rejectedBy: z.string().optional(),
  rejectedDate: z.date().optional(),
  rejectionReason: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  applicationDate: z.date(),
});

export const CreateBirthApplicationSchema = BaseApplication.extend({
  applicationType: z.literal("birth"),
  firstName: z.string().max(100),
  middleNames: z.array(z.string().max(100)).optional(),
  surname: z.string().max(100),
  sex: z.enum(["Male", "Female"]),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  placeOfBirth: z.string().max(100),
  hospitalOfBirthId: z.string(),
  address: z.string().max(200),
  fatherIdNumber: z.string().length(13).optional(),
  motherIdNumber: z.string().length(13),
  documents: z.object({
    hospitalRecord: z.string().url(),
    motherNationalId: z.string().url(),
    fatherNationalId: z.string().url(),
  }),
});
