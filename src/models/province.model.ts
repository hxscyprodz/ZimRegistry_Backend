import { Schema, model } from "mongoose";
import { IProvince} from "../types/types";
import { applyAutoIncrement } from "../utils/dbAutoIncrement";

const ProvinceSchema = new Schema<IProvince>({
    name: { type: String, required: true },
    districts: [{
        name: { type: String, required: true },
        districtId: { type: String, ref: "District" },
    }],
}, {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
});

applyAutoIncrement(ProvinceSchema, {
    idField: "provinceId",
    sequenceId: "province_seq",
    prefix: "P",
    digits: 6,
});

const Province = model<IProvince>("Province", ProvinceSchema);
export default Province;