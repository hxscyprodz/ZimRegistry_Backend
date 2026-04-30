import { Schema, Types, model } from "mongoose";
import { IRefreshToken } from "../types/types";

const RefreshTokenSchema = new Schema<IRefreshToken>({
    userId: {
        type: Types.ObjectId,
        ref: "User",
    },
    refreshToken: {
        type: String,
    }
}, {
    timestamps: true,
});

const RefreshToken = model("RefreshToken", RefreshTokenSchema);
export default RefreshToken;