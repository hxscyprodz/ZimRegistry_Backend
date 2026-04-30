import { Schema, model } from "mongoose";
import { IUser, ERole } from "../types/types";

const UserSchema = new Schema<IUser>({
    fullName: {
        type: String,
        required: [true, "Full name not provided"],
        minlength: [5, "Full name must contain at least 5 characters"],
        maxlength: [50, "Full name must not exceed 50 characters"]
    },
    address: {
        type: String,
        required: [true, "Address not provided"],
        minlength: [10, "Address must contain at least 10 characters"],
        maxlength: [90, "Address must not exceed 90 characters"]
    },
    contactNumber: {
        type: String,
        required: [true, "Phone number not provided"],
        maxlength: 13,
        unique: [true, "Phone number already exist"]
    },
    password: {
        type: String,
        required: [true, "Password not provided"]
    },
    role: {
        type: String,
        default: ERole.user
    }
}, {
    timestamps: true,
});


const User = model("User", UserSchema);
export default User;
