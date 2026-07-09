import { Schema, model } from "mongoose";
import { IHospital } from "../types/types";
import { applyAutoIncrement } from "../utils/autoIncrement";

const HospitalSchema = new Schema<IHospital>(
  {
    createdBy: { type: String, required: true },
    hospitalName: { type: String, required: true },
    district: { type: String, required: true },
    town: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  },
);

applyAutoIncrement(HospitalSchema, {
  idField: "hospitalId",
  sequenceId: "hospital_seq",
  prefix: "HT",
});

const Hospital = model<IHospital>("Hospital", HospitalSchema);
export default Hospital;
