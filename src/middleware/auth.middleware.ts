import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/jwt";
import { CustomRequest } from "../types/types";

const protectRoute = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Token not provided.",
      error: {
        name: "UNAUTHORIZED_ERROR",
        message: "Unauthorized. Token not provided.",
      },
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

export default protectRoute;
