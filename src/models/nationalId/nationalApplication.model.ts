import { Schema, model } from "mongoose";
import { INationalIdApplication, EStatus } from "../../types/types";
import { applyAutoIncrement } from "../../utils/autoIncrement";

const NationalApplicationSchema = new Schema<INationalIdApplication>(
  {
    applicationType: { type: String, default: "national-id" },
    nationalIdNumber: { type: String, required: true },
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
    toJSON: { getters: true },
    toObject: { getters: true },
  },
);

applyAutoIncrement(NationalApplicationSchema, {
  prefix: "NID",
  idField: "applicationId",
  sequenceId: "national_id_application_seq",
});

const NationalIdApplication = model<INationalIdApplication>(
  "NationalIdApplication",
  NationalApplicationSchema,
);
export default NationalIdApplication;
