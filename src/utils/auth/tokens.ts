import jwt from "jsonwebtoken";
import config from "../../config/env.config";
import { ERole, ITokenPayload } from "../../types/types";

const generateAccessToken = async(payload: ITokenPayload) => {
    return await jwt.sign(payload, config.JWT_ACCESS_TOKEN || "", { expiresIn: "15m"});
};

const generateRefreshToken = async(payload: ITokenPayload) => {
    return await jwt.sign(payload, config.JWT_REFRESH_TOKEN || "", { expiresIn: "7d" });
};

const tokenUTILS = {
    generateAccessToken,
    generateRefreshToken,
};

export default tokenUTILS;