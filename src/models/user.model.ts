import { Schema, model } from "mongoose";
import { TUser } from "../types/types";

const UserSchema = new Schema<TUser>(
  {
    phone: { type: String, required: true },
    lastSessionDate: { type: Date, default: new Date() },
    totalApplications: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

const User = model("User", UserSchema);
export default User;
