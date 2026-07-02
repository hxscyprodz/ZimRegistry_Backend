import { Schema, model } from "mongoose";
import { IStation } from "../types/types";

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
  },
);

const Station = model<IStation>("Station", StationSchema);
export default Station;
