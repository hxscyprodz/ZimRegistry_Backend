import { Request, Response } from "express";
import { AuthRequest } from "../../types";
import { StatusCodes } from "http-status-codes";
import { db } from "../../config/db";
import { asc, eq, isNull, ne, or, and } from "drizzle-orm";
import { staffMember, users } from "../../db/schemas";
import logger from "../../services/logger";
import { updateStaffMemberSchema } from "../../validators/validators";
import { hashPassword } from "../../services/bcrypt";

export const getStaffMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid request",
        data: null,
      });
    }

    const [staff] = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        surname: users.surname,
        email: users.email,
        role: users.role,
        staffId: staffMember.staffId,
        status: users.status,
        stationId: staffMember.stationId,
      })
      .from(users)
      .leftJoin(
        staffMember,
        eq(users.nationalIdNumber, staffMember.nationalIdNumber),
      )
      .where(eq(users.id, id))
      .limit(1);

    if (!staff) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Staff member not found",
        data: null,
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Staff member fetched successfully",
      data: staff,
    });
  } catch (error: any) {
    logger.error(
      `An error occurred while fetching staff member: ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching staff member",
      data: null,
    });
  }
};

export const getStaffMembers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const staffMembers = await db
      .select({
        id: users.id,
        staffId: staffMember.staffId,
        stationId: staffMember.stationId,
        nationalIdNumber: staffMember.nationalIdNumber,
        firstName: users.firstName,
        surname: users.surname,
        email: users.email,
        phoneNumber: users.phoneNumber,
        role: users.role,
        status: users.status,
      })
      .from(staffMember)
      .leftJoin(users, eq(staffMember.nationalIdNumber, users.nationalIdNumber))
      .where(or(ne(users.status, "DELETED"), isNull(users.status)))
      .orderBy(asc(users.firstName));

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Staff members fetched successfully",
      data: staffMembers,
      count: staffMembers.length,
    });
  } catch (error: any) {
    logger.error(
      `An error occurred while fetching staff members: ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching staff members",
      data: null,
    });
  }
};

export const updateStaffMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid request",
        data: null,
      });
    }

    const isRequestValid = updateStaffMemberSchema.safeParse(req.body);

    if (!isRequestValid.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Credentials provided are invalid",
        data: null,
      });
    }

    const { confirmPassword, ...newData } = isRequestValid.data;
    if (Object.keys(newData).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message:
          "At least one field must be provided to update the staff member",
        data: null,
      });
    }

    const password = newData.password;
    if (password) {
      if (password !== confirmPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Passwords do not match",
          data: null,
        });
      }

      const hashedPassword = await hashPassword(password);
      newData.password = hashedPassword;
    }

    const [staff] = await db
      .update(users)
      .set(newData)
      .where(and(eq(users.id, id), ne(users.status, "DELETED")))
      .returning({
        id: users.id,
        firstName: users.firstName,
        lastName: users.surname,
        email: users.email,
        role: users.role,
        status: users.status,
      });

    if (!staff) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Staff member not found",
        data: null,
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Staff member updated successfully",
      data: staff,
    });
  } catch (error: any) {
    logger.error(
      `An error occurred while updating staff member: ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while updating staff member",
      data: null,
    });
  }
};

export const deleteStaffMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Internal server error",
        data: null,
      });
    }

    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid request",
        data: null,
      });
    }

    const [deletedUser] = await db
      .update(users)
      .set({
        status: "DELETED",
        deletedAt: new Date(),
      })
      .where(and(eq(users.id, id), ne(users.status, "DELETED")))
      .returning({
        id: users.id,
      });

    if (!deletedUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Staff member not found",
        data: null,
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Staff member deleted successfully",
      data: null,
    });
  } catch (error: any) {
    logger.error(
      `An error occurred while deleting staff member: ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while deleting staff member",
      data: null,
    });
  }
};
