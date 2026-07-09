import { Schema, model } from "mongoose";
import { IHospital } from "../types/types";

const HospitalSchema = new Schema<IHospital>(
  {
    hospitalId: { type: String, required: true },
    createdBy: { type: String, required: true },
    hospitalName: { type: String, required: true },
    district: { type: String, required: true },
    town: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Hospital = model<IHospital>("Hospital", HospitalSchema);
export default Hospital;
