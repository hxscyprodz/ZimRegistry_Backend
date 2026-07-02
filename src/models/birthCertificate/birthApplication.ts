import { Schema, model } from "mongoose";
import { IBirthApplication, EStatus } from "../../types/types";

const BirthApplicationSchema = new Schema<IBirthApplication>(
  {
    applicationId: { type: String, required: true },
    applicationType: { type: String, default: "birth" },
    stationId: { type: String, required: true },
    isPrinted: { type: Boolean, default: false },
    phone: { type: String, required: true },
    firstName: { type: String, required: true },
    middleNames: { type: [String] },
    surname: { type: String, required: true },
    sex: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    hospitalOfBirthId: { type: String, required: true },
    address: { type: String, required: true },
    fatherIdNumber: { type: String },
    motherIdNumber: { type: String, required: true },
    status: { type: String, default: EStatus.PENDING },
    applicationDate: { type: Date, default: Date.now },
    approvedBy: { type: String },
    approvedDate: { type: Date },
    rejectedBy: { type: String },
    rejectedDate: { type: Date },
    rejectionReason: { type: String },
    documents: {
      hospitalRecord: { type: String, required: true },
      motherNationalId: { type: String, required: true },
      fatherNationalId: { type: String },
    },
  },
  {
    timestamps: true,
  },
);

const BirthApplication = model<IBirthApplication>(
  "BirthApplication",
  BirthApplicationSchema,
);
export default BirthApplication;
