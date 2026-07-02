import { Schema, model } from "mongoose";
import { IHospital } from "../types/types";
import { applyAutoIncrement } from "../utils/dbAutoIncrement";

const HospitalSchema = new Schema<IHospital>(
  {
    createdBy: { type: String, required: true, ref: "Staff"},
    hospitalName: { type: String, required: true },
    district: { type: String, required: true, ref: "District" },
    town: { type: String, required: true },
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  },
);

applyAutoIncrement(HospitalSchema, {
  idField: "hospitalId",
  sequenceId: "hospital_seq",
  prefix: "H",
  digits: 6,
});

const Hospital = model<IHospital>("Hospital", HospitalSchema);
export default Hospital;
