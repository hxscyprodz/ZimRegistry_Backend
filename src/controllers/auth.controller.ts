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
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Credentials provided are invalid",
        data: null,
      });
    }

    const isCorrectPassword = await comparePassword(password, user.password);

    if (!isCorrectPassword) {
      logger.warn(
        `[ ${FLAG} ] - Login attempt for user : ${user.id} failed to wrong password`,
      );

      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Credentials provided are invalid",
        data: null,
      });
    }

    logger.info(`[ ${FLAG} ] - Login attempt for user : ${user.id} successful`);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        email: user.email,
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
  const isRequestValid = registerSchema.safeParse(req.body);
  if (!isRequestValid.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Credentials provided are invalid",
      data: null,
    });
  }
  try {
    const {
      email,
      password,
      confirmPassword,
      firstName,
      middleNames,
      surname,
      nationalIdNumber,
      phoneNumber,
    } = isRequestValid.data;

    if (password !== confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Passwords do not match",
        data: null,
      });
    }

    const [userExists] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userExists) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "User already exists",
        data: null,
      });
    }

    const hashedPassword = await hashPassword(password);
    const formattedData = {
      firstName,
      middleNames,
      surname,
      nationalIdNumber,
      phoneNumber,
      email,
      password: hashedPassword,
    };

    const [user] = await db.insert(users).values(formattedData).returning({
      id: users.id,
    });

    logger.info(`[ ${FLAG} ] - User created successfully with id: ${user?.id}`);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user?.id,
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
