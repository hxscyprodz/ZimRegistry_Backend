import { Schema, model } from "mongoose";
import { IStation } from "../types/types";
import { applyAutoIncrement } from "../utils/autoIncrement";

const StationSchema = new Schema<IStation>(
  {
    stationId: { type: String, required: true },
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
    toJSON: { getters: true },
    toObject: { getters: true },
  },
);

applyAutoIncrement(StationSchema, {
  idField: "stationId",
  sequenceId: "station_seq",
  prefix: "ST",
});

const Station = model<IStation>("Station", StationSchema);
export default Station;
