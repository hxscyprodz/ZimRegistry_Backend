import { Schema, model } from "mongoose";
import { IDistrict } from "../types/types";
import { applyAutoIncrement } from "../utils/autoIncrement";

const DistrictSchema = new Schema(
  {
    provinceId: { type: String, required: true, ref: "Province" },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  },
);

applyAutoIncrement(DistrictSchema, {
  idField: "districtId",
  sequenceId: "district_seq",
  prefix: "DT",
});

const District = model<IDistrict>("District", DistrictSchema);
export default District;
