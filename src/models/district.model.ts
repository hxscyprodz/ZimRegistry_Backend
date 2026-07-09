import { Schema, model } from "mongoose";
import { IDistrict } from "../types/types";

const DistrictSchema = new Schema({
  districtId: { type: String, required: true },
  provinceId: { type: String, required: true, ref: "Province" },
  name: { type: String, required: true },
});

const District = model<IDistrict>("District", DistrictSchema);
export default District;
