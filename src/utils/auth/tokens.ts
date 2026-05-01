import jwt from "jsonwebtoken";
import config from "../../config/env.config";
import { ITokenPayload } from "../../types/types";

const generateAccessToken = async(payload: ITokenPayload) => {
    return await jwt.sign(payload, config.JWT_ACCESS_TOKEN || "", { expiresIn: "15m"});
};

const generateRefreshToken = async(payload: ITokenPayload) => {
    return await jwt.sign(payload, config.JWT_REFRESH_TOKEN || "", { expiresIn: "7d" });
};

const verifyAccessToken = async(token: string) => {
    return await jwt.verify(token, config.JWT_ACCESS_TOKEN || "");
};

const verifyRefreshToken = async(token: string) => {
    return await jwt.verify(token, config.JWT_REFRESH_TOKEN || "");
};


const tokenUTILS = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};

export default tokenUTILS;