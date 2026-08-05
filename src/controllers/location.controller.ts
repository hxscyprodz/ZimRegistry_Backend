import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { StatusCodes } from "http-status-codes";
import { provinces, districts } from "../db/schemas";
import logger from "../services/logger";

export const getProvinces = async (req: Request, res: Response) => {
  try {
    const result = await db
      .select({ id: provinces.id, name: provinces.name })
      .from(provinces);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Provinces fetched successfully",
      data: result,
      count: result.length,
    });
  } catch (error: any) {
    logger.error(
      `An error occurred while fetching provinces: ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching provinces",
      data: null,
    });
  }
};

export const getDistricts = async (req: Request, res: Response) => {
  try {
    const { provinceId } = req.query;
    const query = await db
      .select({
        id: districts.id,
        name: districts.name,
        code: districts.code,
        provinceId: districts.provinceId,
      })
      .from(districts);

    const result = provinceId
      ? await db
          .select({
            id: districts.id,
            name: districts.name,
            code: districts.code,
            provinceId: districts.provinceId,
          })
          .from(districts)
          .where(eq(districts.provinceId, provinceId))
      : query;

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Districts fetched successfully",
      data: result,
      count: result.length,
    });
  } catch (error: any) {
    logger.error(
      `An error occurred while fetching districts: ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching districts",
      data: null,
    });
  }
};
