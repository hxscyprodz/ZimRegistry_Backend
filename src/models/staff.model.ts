import { Schema, model } from "mongoose";
import { IStaff, ERole } from "../types/types";

const StaffSchema = new Schema<IStaff>(
  {
    staffId: { type: String, required: true },
    stationId: { type: String, required: true },
    createdBy: { type: String, required: true },
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    nationalIdNumber: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true, enum: Object.values(ERole) },
    password: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const Staff = model<IStaff>("Staff", StaffSchema);
export default Staff;
