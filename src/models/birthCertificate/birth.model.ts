import { Schema, model } from "mongoose";
import { IBirthCertificate } from "../../types/types";

const BirthCertificateSchema = new Schema<IBirthCertificate>(
  {
    nationalIdNumber: { type: String, required: true },
    firstName: { type: String, required: true },
    middleNames: { type: [String] },
    surname: { type: String, required: true },
    sex: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    hospitalOfBirth: { type: String, required: true },
    mother: {
      idNumber: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      birthPlace: { type: String, required: true },
    },
    father: {
      idNumber: { type: String },
      firstName: { type: String },
      lastName: { type: String },
      birthPlace: { type: String },
    },
    dateOfRegistration: { type: Date, default: Date.now },
    dateOfIssue: { type: Date, required: true },
    placeOfIssue: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const BirthCertificate = model<IBirthCertificate>(
  "BirthCertificate",
  BirthCertificateSchema,
);
export default BirthCertificate;
