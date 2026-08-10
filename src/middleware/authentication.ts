import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { authenticationHeaderSchema } from "../validators/validators";
import { verifyAccessToken } from "../services/jsonwebtokens";
import logger from "../services/logger";
import { AuthRequest } from "../types";

const FLAG = "AUTHENTICATION";

export const authenticationMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const isHeaderValid = authenticationHeaderSchema.safeParse(req.headers);
    if (!isHeaderValid.success) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Token provided is invalid",
        data: null,
      });
    }
    const token = isHeaderValid.data.authorization.split(" ")[1];
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid token format. Expected 'Bearer <token>'.",
        data: null,
      });
    }
    const payload = await verifyAccessToken(token);
    if (!payload) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Token provided is invalid",
        data: null,
      });
    }

    req.user = payload;
    return next();
  } catch (error: any) {
    logger.error(
      `[ ${FLAG} ] - An error occurred while authenticating user: ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while authenticating user",
      data: null,
    });
  }
};
