import Staff from "../../models/staff.model";
import { Request, Response } from "express";
import logger from "../../services/logger";
import { StatusCodes } from "http-status-codes";
import { StaffSchema } from "../../validators/validators";
import { generateAccessToken } from "../../services/jwt";
import { comparePassword } from "../../services/bcrypt";
import { formatStaffId } from "../../utils/formatStaffId";
import { CustomRequest } from "../../types/types";

const FLAG = "AUTH";

export const login = async (req: Request, res: Response) => {
  const valid = StaffSchema.safeParse(req.body);
  try {
    if (!valid.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid credentials. Please try again",
        error: {
          name: "INVALID_CREDENTIALS_ERROR",
          message: valid.error?._zod.def[0].message,
        },
      });
    }

    const staff = await Staff.findOne({ phone: req.body.phone });

    if (!staff) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid credentials. Please try again",
        error: {
          name: "INVALID_CREDENTIALS_ERROR",
          message: "Invalid credentials. Please try again",
        },
      });
    }

    const isValidPassword = await comparePassword(
      req.body.password,
      staff.password,
    );

    if (!isValidPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid credentials. Please try again",
        error: {
          name: "INVALID_CREDENTIALS_ERROR",
          message: "Invalid credentials. Please try again",
        },
      });
    }

    const staffData = {
      employeeNumber: formatStaffId(staff.staffId),
      role: staff.role,
      name: `${staff.firstName} ${staff.surname}`,
      stationId: staff.stationId,
    };

    const token = await generateAccessToken(staffData);

    return res.status(StatusCodes.OK).json({
      success: true,
      user: staffData,
      message: "Login successful",
      token,
    });
  } catch (error: any) {
    logger.error(`[ ${FLAG} ] - Error occurred: ${error?.message}`);
  }
};

export const getProfile = async (req: CustomRequest, res: Response) => {
  try {
    return res.status(StatusCodes.OK).json({
      success: true,
      user: req.user,
    });
  } catch (error: any) {
    logger.error(`[ ${FLAG} ] - Error occurred: ${error?.message}`);
  }
};

export const logout = async () => {
  try {
  } catch (error: any) {
    logger.error(`[ ${FLAG} ] - Error occurred: ${error?.message}`);
  }
};
