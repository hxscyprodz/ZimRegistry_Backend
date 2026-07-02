import { Schema, model } from "mongoose";
import { INationalIdApplication, EStatus } from "../../types/types";

const NationalApplicationSchema = new Schema<INationalIdApplication>(
  {
    applicationId: { type: String, required: true },
    applicationType: { type: String, default: "national-id" },
    stationId: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, default: EStatus.PENDING },
    applicationDate: { type: Date, default: Date.now },
    approvedBy: { type: String },
    approvedDate: { type: Date },
    rejectedBy: { type: String },
    rejectedDate: { type: Date },
    rejectionReason: { type: String },
    documents: {
      birthCertificate: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  },
);

const NationalIdApplication = model<INationalIdApplication>(
  "NationalIdApplication",
  NationalApplicationSchema,
);
export default NationalIdApplication;
