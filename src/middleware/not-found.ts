import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import CustomError from "../utils/CustomError";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = new CustomError(`Not Found - ${req.originalUrl}`, StatusCodes.NOT_FOUND);
  next(error);
};
