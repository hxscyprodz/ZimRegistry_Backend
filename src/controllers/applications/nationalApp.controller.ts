import { Request, Response } from "express";
import { db } from "../../config/db";
import { eq } from "drizzle-orm";
import { nationalIdApplicationSchema } from "../../validators/validators";
import logger from "../../services/logger";
import { StatusCodes } from "http-status-codes";
import {
  birthCertificates,
  nationalIdApplications,
  districts,
  users,
} from "../../db/schemas";
import { generateTrackId } from "../../utils/trackId";
import { AuthRequest } from "../../types";
import { calculateAge } from "../../utils/calculateYears";

export const createApplication = async (req: AuthRequest, res: Response) => {
  const FLAG = "ID_APPLICATION";
  const isRequestValid = nationalIdApplicationSchema.safeParse(req.body);
  if (!isRequestValid.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Credentials provided are invalid",
      data: null,
    });
  }

  try {
    const { nationalIdNumber, contactNumber, stationId } = isRequestValid.data;

    const isStationAvailable = await db
      .select({
        id: districts.id,
      })
      .from(districts)
      .where(eq(districts.id, stationId))
      .limit(1);
    if (isStationAvailable.length <= 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Station not found",
        data: null,
      });
    }

    const isBirthCertificateAvailable = await db
      .select({
        id: birthCertificates.id,
        dateOfBirth: birthCertificates.dateOfBirth,
      })
      .from(birthCertificates)
      .where(eq(birthCertificates.nationalIdNumber, nationalIdNumber))
      .limit(1);
    if (isBirthCertificateAvailable.length <= 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "ID Number not found",
        data: null,
      });
    }

    const ageToday = calculateAge(isBirthCertificateAvailable[0]?.dateOfBirth!);
    if (ageToday < 16) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Not yet legible to apply for ID",
        data: null,
      });
    }

    const trackingId = await generateTrackId("ID");

    const application = await db
      .insert(nationalIdApplications)
      .values({
        userId: req.user?.userId!,
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
      success: true,
      message: "Application created successfully",
      data: application,
    });
  } catch (error: any) {
    console.log(error);
    logger.error(
      `[ ${FLAG}] - An error occurred while creating application: ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while creating application",
      data: null,
    });
  }
};

export const getApplications = async (req: AuthRequest, res: Response) => {
  const FLAG = "GET_ID_APPLICATIONS";
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }
    const applications = await db
      .select({
        firstName: users.firstName,
        surname: users.surname,
        nationalIdNumber: nationalIdApplications.nationalIdNumber,
        contactNumber: nationalIdApplications.contactNumber,
        stationId: nationalIdApplications.stationId,
        status: nationalIdApplications.status,
        trackingId: nationalIdApplications.trackingId,
        createdAt: nationalIdApplications.createdAt,
        approvedBy: nationalIdApplications.approvedBy,
        rejectedBy: nationalIdApplications.rejectedBy,
        isPrinted: nationalIdApplications.isPrinted,
      })
      .from(nationalIdApplications)
      .leftJoin(users, eq(users.id, nationalIdApplications.userId));
    if (applications.length <= 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No applications found",
        data: null,
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Applications fetched successfully",
      data: applications,
    });
  } catch (error: any) {
    logger.error(
      `[${FLAG}] - An error occurred while fetching applications: ${error.message}`,
    );
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "An error occurred while fetching applications",
    data: null,
  });
};
