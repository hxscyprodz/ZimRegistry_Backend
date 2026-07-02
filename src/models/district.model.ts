import { Schema, model } from "mongoose";
import { IDistrict} from "../types/types";
import { applyAutoIncrement } from "../utils/dbAutoIncrement";

const DistrictSchema = new Schema<IDistrict>({
    name: { type: String, required: true },
    provinceId: { type: String, required: true, ref: "Province" },
}, {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
});

applyAutoIncrement(DistrictSchema, {
    idField: "districtId",
    sequenceId: "district_seq",
    prefix: "D",
    digits: 6,
});

const District = model<IDistrict>("District", DistrictSchema);
export default District;