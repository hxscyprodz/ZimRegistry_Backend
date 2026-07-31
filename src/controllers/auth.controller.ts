import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { loginSchema, registerSchema } from "../validators/validators";
import { hashPassword, comparePassword } from "../services/bcrypt";
import { users } from "../db/schemas";
import { db } from "../config/db";
import CustomError from "../utils/CustomError";
import logger from "../services/logger";
import { eq } from "drizzle-orm";

export const login = async (req: Request, res: Response) => {
  const FLAG = "USER_LOGIN";
  const isRequestValid = loginSchema.safeParse(req.body);

  if (!isRequestValid.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Credentials provided are invalid",
      data: null,
    });
  }
  try {
    const { email, password } = isRequestValid.data;
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (user.length === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Credentials provided are invalid",
        data: null,
      });
    }

    const isCorrectPassword = await comparePassword(
      password,
      user[0]?.password!,
    );

    if (!isCorrectPassword) {
      logger.warn(
        `[ ${FLAG} ] - Login attempt for user : ${user[0]?.id} failed to wrong password`,
      );

      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Credentials provided are invalid",
        data: null,
      });
    }

    logger.info(
      `[ ${FLAG} ] - Login attempt for user : ${user[0]?.id} successful`,
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      data: {
        id: user[0]?.id,
        email: user[0]?.email,
      },
    });
  } catch (error: any) {
    logger.error(
      `[ ${FLAG} ] - An error occurred while logging in : ${error.message}`,
    );
    throw new CustomError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const register = async (req: Request, res: Response) => {
  const FLAG = "USER_REGISTRATION";
  let isRequestValid = registerSchema.safeParse(req.body);
  if (!isRequestValid.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Credentials provided are invalid",
      data: null,
    });
  }
  try {
    const { email, password, confirmPassword } = isRequestValid.data;

    if (password !== confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Passwords do not match",
        data: null,
      });
    }

    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userExists.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "User already exists",
        data: null,
      });
    }

    const hashedPassword = await hashPassword(password);
    isRequestValid.data.password = hashedPassword;

    const user = await db.insert(users).values(isRequestValid.data).returning({
      id: users.id,
    });

    logger.info(
      `[ ${FLAG} ] - User created successfully with id: ${user[0]?.id}`,
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user[0]?.id,
      },
    });
  } catch (error: any) {
    logger.error(
      `[ ${FLAG} ] - An error occurred while registering a user: ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while registering a user",
      data: null,
    });
  }
};
