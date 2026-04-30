import jwt from "jsonwebtoken";
import config from "../../config/env.config";
import { ERole, ITokenPayload } from "../../types/types";

export const generateAccessToken = async(payload: ITokenPayload) => {
    return await jwt.sign(payload, config.JWT_ACCESS_TOKEN || "");
};

export const generateRefreshToken = async(payload: ITokenPayload) => {
    return await jwt.sign(payload, config.JWT_REFRESH_TOKEN || "");
};