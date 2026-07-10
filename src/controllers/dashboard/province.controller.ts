import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Province from "../../models/province.model";
import logger from "../../services/logger";
import { success } from "zod";

const FLAG = "PROVINCE_CONTROLLER";

export const getAllProvinces = async (req: Request, res: Response) => {
  try {
    const provinces = await Province.find({}).sort({ name: 1 });
    res.status(StatusCodes.OK).json({
      success: true,
      data: provinces,
      count: provinces.length,
      message: "Provinces retrieved successfully.",
    });
  } catch (error: any) {
    logger.error(`[ ${FLAG} ] - Error fetching provinces: ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while retrieving provinces.",
    });
  }
};

export const getProvince = async (req: Request, res: Response) => {
  try {
    const province = await Province.findById(req.params.id);
    if (!province) {
      return res.status(404).json({
        success: false,
        message: "Province not found",
      });
    }
    res.status(StatusCodes.OK).json({
      success: true,
      data: province,
      message: "Province retrieved successfully.",
    });
  } catch (error: any) {
    logger.error(
      `[ ${FLAG} ] - Error fetching province by ID: ${error.message}`,
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while retrieving the province.",
    });
  }
};

export const updateProvince = async (req: Request, res: Response) => {
  try {
    const province = await Province.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!province) {
      return res.status(404).json({
        success: false,
        message: "Province not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: province,
      message: "Province updated successfully.",
    });
  } catch (error: any) {
    logger.error(`[ ${FLAG} ] - Error updating province: ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while updating the province.",
    });
  }
};
