import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Staff from "../../models/staff.model";
import { CreateStaffDTO } from "../../validators/validators";
import logger from "../../services/logger";
import { hashPassword } from "../../services/bcrypt";
import { CustomRequest } from "../../types/types";

const FLAG = "STAFF";

export const createStaff = async (req: CustomRequest, res: Response) => {
  const valid = CreateStaffDTO.safeParse(req.body);
  try {
    if (!valid.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const { email, phone, nationalIdNumber, password } = req.body;

    const existingStaff = await Staff.findOne({
      $or: [{ email }, { phone }, { nationalIdNumber }],
    });
    if (existingStaff) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message:
          "Staff member with the same email, phone, or national ID already exists.",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newStaff = await Staff.create({
      ...req.body,
      password: hashedPassword,
      createdBy: req.user.id,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Staff member created successfully.",
    });
  } catch (error: any) {
    logger.error(`[${FLAG}] - Error adding staff: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while adding the staff member.",
    });
  }
};

export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.find().select("-password");
    return res.status(StatusCodes.OK).json({
      success: true,
      data: staff,
      count: staff.length,
      message: "Staff members retrieved successfully.",
    });
  } catch (error: any) {
    logger.error(`[${FLAG}] - Error getting all staff: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while retrieving staff members.",
    });
  }
};

export const getStaff = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findById(req.params.id).select("-password");
    if (!staff) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Staff not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      data: staff,
      message: "Staff member retrieved successfully.",
    });
  } catch (error: any) {
    logger.error(`[${FLAG}] - Error getting staff by ID: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while retrieving the staff member.",
    });
  }
};

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { password, ...updateData } = req.body;
    if (password) {
      updateData.password = await hashPassword(password);
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" },
    ).select("-password");

    if (!updatedStaff) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Staff not found" });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Staff member updated successfully.",
    });
  } catch (error: any) {
    logger.error(`[${FLAG}] - Error updating staff: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while updating the staff member.",
    });
  }
};

export const updateStaffStatus = async (req: Request, res: Response) => {
  try {
    const staffMember = await Staff.findById({ _id: req.params.id });
    if (!staffMember) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Staff member not found",
      });
    }

    staffMember.status = !staffMember.status;
    await staffMember.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Staff member status updated successfully.",
    });
  } catch (error: any) {
    logger.error(`[${FLAG}] - Error updating staff status: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while updating the staff status.",
    });
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Staff not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Staff member deleted successfully.",
    });
  } catch (error: any) {
    logger.error(`[${FLAG}] - Error deleting staff: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while deleting the staff member.",
    });
  }
};
