import jwt from "jsonwebtoken";
import { config } from "../config/envConfig";
import logger from "./logger";
import { ITokenPayload } from "../types";

export const generateAccessToken = (user: ITokenPayload) => {
  const FLAG = "ACCESS_TOKEN_GENERATION";
  try {
    return jwt.sign(user, config.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  } catch (error: any) {
    logger.error(
      `[${FLAG}] - An error occurred while generating access token: ${error.message}`,
    );
  }
};

export const verifyAccessToken = (token: string): ITokenPayload | null => {
  const FLAG = "ACCESS_TOKEN_VERIFICATION";
  try {
    return jwt.verify(token, config.ACCESS_TOKEN_SECRET) as ITokenPayload;
  } catch (error: any) {
    logger.error(
      `[${FLAG}] - An error occurred while verifying access token: ${error.message}`,
    );
    return null;
  }
};
