import { Request, Response, NextFunction } from "express";

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = (err as any).statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const response = {
    success: false,
    status: (err as any).status || "error",
    message: err.message,
    stack: (process.env.APP_ENV === "production" || process.env.NODE_ENV === "production") ? null : err.stack,
  };

  res.status(statusCode).json(response);
};
