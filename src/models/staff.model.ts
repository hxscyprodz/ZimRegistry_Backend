import { Schema, model } from "mongoose";
import { IStaff, ERole } from "../types/types";
import { applyAutoIncrement } from "../utils/autoIncrement";

const StaffSchema = new Schema<IStaff>(
  {
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
    toJSON: { getters: true },
    toObject: { getters: true },
  },
);

applyAutoIncrement(StaffSchema, {
  idField: "staffId",
  sequenceId: "staff_seq",
  prefix: "SF",
});

const Staff = model<IStaff>("Staff", StaffSchema);
export default Staff;
