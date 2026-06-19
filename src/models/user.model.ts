import { Schema, model } from "mongoose";
import { TUser } from "../types/types";

const UserSchema = new Schema<TUser>(
  {
    phoneNumber: { type: String, required: true },
    lastSession: { type: Date, default: new Date() },
    totalApplications: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

const User = model("User", UserSchema);
export default User;
