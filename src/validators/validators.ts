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
});

export const authenticationHeaderSchema = z.object({
  authorization: z.string().startsWith("Bearer "),
});

export const birthApplicationSchema = z.object({
  stationId: z.uuid(),
  firstName: z.string().min(2).max(50),
  surname: z.string().min(2).max(50),
  middleNames: z.string().min(2).max(100).optional(),
  sex: z.enum(["male", "female"]),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hospitalOfBirth: z.string().min(2).max(255),
  placeOfBirth: z.string().min(2).max(100),
  address: z.string().min(2).max(255),
  villageOfOrigin: z.string().min(2).max(100),
  mothersIdNumber: z.string().min(15).max(15),
  fathersIdNumber: z.string().min(15).max(15).optional(),
  hospitalRecordUri: z.string().min(2).max(255),
  motherIdUri: z.url(),
  fatherIdUri: z.url().optional(),
});
