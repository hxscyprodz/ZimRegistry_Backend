import jwt from "jsonwebtoken";
import { Types} from "mongoose";
import config from "../config/envConfig";
import logger from "./logger";
import { ERole } from "../types/types";

interface StaffMember {
  employeeNumber: string;
  id: Types.ObjectId;
  role: ERole;
  name: string;
  stationId: string;
}

const { ACCESS_TOKEN_SECRET } = config;

export const generateAccessToken = (payload: StaffMember) => {
  try {
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET || "", {
      expiresIn: "1h",
    });
    return accessToken;
  } catch (error: any) {
    logger.error(
      `Error occurred while generating access token: ${error?.message}`,
    );
  }
};

export const verifyAccessToken = (token: string) => {
  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET || "");
    return payload;
  } catch (error: any) {
    logger.error(
      `Error occurred while verifying access token: ${error?.message}`,
    );
  }
};
