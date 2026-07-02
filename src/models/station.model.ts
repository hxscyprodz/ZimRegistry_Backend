import { Schema, model } from "mongoose";
import { IStation } from "../types/types";
import { applyAutoIncrement } from "../utils/dbAutoIncrement";

const StationSchema = new Schema<IStation>(
  {
    createdBy: { type: String, required: true },
    stationName: { type: String, required: true },
    location: {
      province: { type: String, required: true },
      district: { type: String, required: true },
      town: { type: String, required: true },
      address: { type: String, required: true },
    },
    numberOfStaff: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  },
);

applyAutoIncrement(StationSchema, {
  idField: "stationId",
  sequenceId: "station_seq",
  prefix: "ST",
  digits: 6,
});


const Station = model<IStation>("Station", StationSchema);
export default Station;
