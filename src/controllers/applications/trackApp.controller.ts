import { Request, Response } from "express";
import { db } from "../../config/db";
import { eq } from "drizzle-orm";
import { nationalIdApplications, birthApplications } from "../../db/schemas";
import { StatusCodes } from "http-status-codes";
import logger from "../../services/logger";

export const trackApplication = async (req: Request, res: Response) => {
  try {
    const { trackingId } = req.params;

    if (!trackingId || typeof trackingId !== "string") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid tracking ID provided",
        data: null,
      });
    }

    const applicationType = trackingId.startsWith("BC")
      ? "birth"
      : "id";

    const targetTable =
      applicationType === "birth" ? birthApplications : nationalIdApplications;

    const [application] = await db
      .select({
        id: targetTable.id,
        trackingId: targetTable.trackingId,
        status: targetTable.status,
      })
      .from(targetTable)
      .where(eq(targetTable.trackingId, trackingId))
      .limit(1);

    if (!application) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `Application with tracking ID ${trackingId} not found`,
        data: null,
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Application fetched successfully",
      data: application,
    });
  } catch (error: any) {
    logger.error(
      `An error occurred while fetching application: ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching application",
      data: null,
    });
  }
};
