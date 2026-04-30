import { Schema, model, Types } from "mongoose";

const RefreshTokenSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "User",
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

const RefreshToken = model("RefreshToken", RefreshTokenSchema);
export default RefreshToken;
