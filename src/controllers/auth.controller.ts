import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { loginSchema, registerSchema } from "../validators/validators";
import { hashPassword, comparePassword } from "../services/bcrypt";
import { staffMember, users } from "../db/schemas";
import { birthCertificates } from "../db/schemas";
import { db } from "../config/db";
import logger from "../services/logger";
import { eq, or } from "drizzle-orm";
import { generateAccessToken } from "../services/jsonwebtokens";
import { AuthRequest } from "../types";

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
      .select({
        users: {
          id: users.id,
          firstName: users.firstName,
          surname: users.surname,
          email: users.email,
          role: users.role,
          password: users.password,
        },
        staffMember: {
          staffId: staffMember.staffId,
          stationId: staffMember.stationId,
        },
      })
      .from(users)
      .where(eq(users.email, email))
      .leftJoin(
        staffMember,
        eq(users.nationalIdNumber, staffMember.nationalIdNumber),
      )
      .limit(1);
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Credentials provided are invalid",
        data: null,
      });
    }

    const isCorrectPassword = await comparePassword(
      password,
      user.users.password!,
    );

    if (!isCorrectPassword) {
      logger.warn(
        `[ ${FLAG} ] - Login attempt for user : ${user?.users.id} failed to wrong password`,
      );

      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Credentials provided are invalid",
        data: null,
      });
    }

    const token = generateAccessToken({
      userId: user.users.id!,
      role: user.users.role!,
    });

    logger.info(
      `[ ${FLAG} ] - Login attempt for user : ${user.users.id} successful`,
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      user: {
        id: user?.users.id,
        email: user?.users.email,
        name: `${user?.users.firstName} ${user?.users.surname}`,
        role: user?.users.role,
        stationId: user?.staffMember?.stationId && user?.staffMember?.stationId,
        employeeNumber:
          user?.staffMember?.staffId && user?.staffMember?.staffId,
      },
      token,
    });
  } catch (error: any) {
    logger.error(
      `[ ${FLAG} ] - An error occurred while logging in : ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while logging in",
      data: null,
    });
  }
};

export const profile = async (req: AuthRequest, res: Response) => {
  const FLAG = "USER_PROFILE";
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const [user] = await db
      .select({
        user: {
          id: users.id,
          role: users.role,
          firstName: users.firstName,
          surname: users.surname,
        },
        staffMember: {
          stationId: staffMember.stationId,
          staffId: staffMember.staffId,
        },
      })
      .from(users)
      .leftJoin(
        staffMember,
        eq(users.nationalIdNumber, staffMember.nationalIdNumber),
      )
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Bad credentials provided",
        data: null,
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Profile fetched successfully",
      user: {
        id: user.user.id,
        employeeNumber: user.staffMember?.staffId,
        stationId: user.staffMember?.stationId,
        role: user.user.role,
        name: `${user.user.firstName} ${user.user.surname}`,
      },
    });
  } catch (error: any) {
    logger.error(
      `[ ${FLAG} ] - An error occurred while fetching profile : ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching profile",
      data: null,
    });
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
    const { confirmPassword, ...userData } = isRequestValid.data;
    const { nationalIdNumber, email, password } = userData;

    if (password !== confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Passwords do not match",
        data: null,
      });
    }

    const [isNationalIdRegistered] = await db
      .select({
        nationalIdNumber: birthCertificates.nationalIdNumber,
      })
      .from(birthCertificates)
      .where(eq(birthCertificates.nationalIdNumber, nationalIdNumber))
      .limit(1);

    if (!isNationalIdRegistered) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "National ID Number not registered",
        data: null,
      });
    }

    const [userExists] = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, email),
          eq(users.nationalIdNumber, nationalIdNumber),
          eq(users.phoneNumber, userData.phoneNumber),
        ),
      )
      .limit(1);

    if (userExists) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "User already exists",
        data: null,
      });
    }

    const hashedPassword = await hashPassword(password);

    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        role: users.role,
      });

    const token = generateAccessToken({
      userId: user?.id!,
      role: user?.role!,
    });

    logger.info(`[ ${FLAG} ] - User created successfully with id: ${user?.id}`);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user?.id,
      },
      token,
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
