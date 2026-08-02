import { Request, Response } from "express";
import { db } from "../../config/db";
import { eq } from "drizzle-orm";
import { nationalIdApplicationSchema } from "../../validators/validators";
import logger from "../../services/logger";
import { StatusCodes } from "http-status-codes";
import { birthCertificates, nationalIdApplications } from "../../db/schemas";
import { generateTrackId } from "../../utils/trackId";

export const createApplication = async (req: Request, res: Response) => {
  const FLAG = "ID_APPLICATION";
  const isRequestValid = nationalIdApplicationSchema.safeParse(req.body);
  if (!isRequestValid.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "false",
      message: "Credentials provided are invalid",
      data: null,
    });
  }

  try {
    const { nationalIdNumber, contactNumber, stationId } = isRequestValid.data;

    const isBirthCertificateAvailable = await db
      .select({
        id: birthCertificates.id,
      })
      .from(birthCertificates)
      .where(eq(birthCertificates.nationalIdNumber, nationalIdNumber))
      .limit(1);
    if (isBirthCertificateAvailable.length <= 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "false",
        message: "ID Number not found",
        data: null,
      });
    }

    const trackingId = await generateTrackId("ID");
    const application = await db
      .insert(nationalIdApplications)
      .values({
        userId,
        stationId,
        contactNumber,
        nationalIdNumber,
        trackingId,
      })
      .returning({
        id: nationalIdApplications.id,
        trackingId: nationalIdApplications.trackingId,
        status: nationalIdApplications.status,
      });

    logger.info(
      `[ ${FLAG}] - Application with tracking id ${trackingId} created successfully for Birth ${nationalIdNumber}`,
    );
    return res.status(StatusCodes.CREATED).json({
      status: "true",
      message: "Application created successfully",
      data: application,
    });
  } catch (error: any) {
    logger.error(
      `[ ${FLAG}] - An error occurred while creating application: ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "false",
      message: "An error occurred while creating application",
      data: null,
    });
  }
};
