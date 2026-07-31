import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import CustomError from "../utils/CustomError";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Route not found",
    error: error.message
  });
  const err =new CustomError(error.message, StatusCodes.NOT_FOUND);
  next(err);
};
