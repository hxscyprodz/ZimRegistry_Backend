import { Schema, model } from "mongoose";
import { IProvince } from "../types/types";

const ProvinceSchema = new Schema({
  provinceId: { type: String, required: true },
  name: { type: String, required: true },
  districts: [
    {
      type: Schema.Types.ObjectId,
      ref: "District",
    },
  ],
});

const Province = model<IProvince>("Province", ProvinceSchema);
export default Province;
