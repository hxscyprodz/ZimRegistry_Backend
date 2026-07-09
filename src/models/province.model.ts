import { Schema, model } from "mongoose";
import { IProvince } from "../types/types";
import { applyAutoIncrement } from "../utils/autoIncrement";

const ProvinceSchema = new Schema(
  {
    name: { type: String, required: true },
    districts: [{
        name: { type: String, required: true },
    }],
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  },
);

applyAutoIncrement(ProvinceSchema, {
  idField: "provinceId",
  sequenceId: "province_seq",
  prefix: "PR",
});

const Province = model<IProvince>("Province", ProvinceSchema);
export default Province;
