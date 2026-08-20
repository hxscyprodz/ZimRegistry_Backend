import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../../types";
import { birthApplicationSchema } from "../../validators/validators";
import { db } from "../../config/db";
import { birthApplications, birthCertificates } from "../../db/schemas";
import { inArray, eq } from "drizzle-orm";
import { generateTrackId } from "../../utils/trackId";
import logger from "../../services/logger";
import { alias } from "drizzle-orm/pg-core";

export const createApplication = async (req: AuthRequest, res: Response) => {
  const FLAG = "BIRTH_APPLICATION";
  try {
    const isRequestValid = birthApplicationSchema.safeParse(req.body);
    if (!isRequestValid.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Credentials provided are invalid",
        data: null,
      });
    }
    const { fathersIdNumber, mothersIdNumber } = isRequestValid.data;
    const parentIds: string[] = [mothersIdNumber];
    if (fathersIdNumber) {
      parentIds.push(fathersIdNumber);
    }

    const isBirthCertificateAvailable = await db
      .select({
        id: birthCertificates.id,
        nationalIdNumber: birthCertificates.nationalIdNumber,
        firstName: birthCertificates.firstName,
        surname: birthCertificates.surname,
        sex: birthCertificates.sex,
      })
      .from(birthCertificates)
      .where(inArray(birthCertificates.nationalIdNumber, parentIds))
      .limit(2);

    if (isBirthCertificateAvailable.length < parentIds.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message:
          "One or two of the parent ID Number not found in the birth records",
        data: null,
      });
    }
    const trackingId = await generateTrackId("BC");

    const result = await db
      .insert(birthApplications)
      .values({
        userId: req.user?.userId!,
        trackingId,
        ...isRequestValid.data,
      })
      .returning({
        id: birthApplications.id,
        trackingId: birthApplications.trackingId,
        status: birthApplications.status,
      });

    logger.info(
      `[${FLAG}] Application with tracking id ${trackingId} created successfully for Birth ${mothersIdNumber}`,
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Application created successfully",
      data: result,
    });
  } catch (error: any) {
    logger.error(
      `[${FLAG}] An error occurred while creating application: ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while creating application",
      data: null,
    });
  }
};

export const getApplications = async (req: AuthRequest, res: Response) => {
  const FLAG = "GET_BIRTH_APPLICATIONS";
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }
    const applications = await db.select().from(birthApplications).orderBy();
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
      count: applications.length,
    });
  } catch (error: any) {
    logger.error(
      `[${FLAG}] An error occurred while fetching applications: ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching applications",
      data: null,
    });
  }
};

export const getApplication = async (req: AuthRequest, res: Response) => {
  const FLAG = "GET_BIRTH_APPLICATION";
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid application id",
        data: null,
      });
    }

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const mother = alias(birthCertificates, "mother");
    const father = alias(birthCertificates, "father");

    const [application] = await db
      .select({
        id: birthApplications.id,
        trackingId: birthApplications.trackingId,
        status: birthApplications.status,
        stationId: birthApplications.stationId,
        firstName: birthApplications.firstName,
        surname: birthApplications.surname,
        sex: birthApplications.sex,
        dateOfBirth: birthApplications.dateOfBirth,
        placeOfBirth: birthApplications.placeOfBirth,
        address: birthApplications.address,
        villageOfOrigin: birthApplications.villageOfOrigin,
        hospitalOfBirth: birthApplications.hospitalOfBirth,
        createdAt: birthApplications.createdAt,
        approvedBy: birthApplications.approvedBy,
        rejectedBy: birthApplications.rejectedBy,
        isPrinted: birthApplications.isPrinted,
        documents: {
          fatherNationalId: birthApplications.fatherIdUri,
          motherNationalId: birthApplications.motherIdUri,
          hospitalRecord: birthApplications.hospitalRecordUri,
        },
        mother: {
          nationalIdNumber: mother.nationalIdNumber,
          firstName: mother.firstName,
          surname: mother.surname,
        },
        father: {
          nationalIdNumber: father.nationalIdNumber,
          firstName: father.firstName,
          surname: father.surname,
        },
      })
      .from(birthApplications)
      .leftJoin(
        mother,
        eq(mother.nationalIdNumber, birthApplications.mothersIdNumber),
      )
      .leftJoin(
        father,
        eq(father.nationalIdNumber, birthApplications.fathersIdNumber),
      )
      .where(eq(birthApplications.id, id));

    if (!application) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Application not found",
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
      `[${FLAG}] An error occurred while fetching application: ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching application",
      data: null,
    });
  }
};

export const approveApplication = async (req: AuthRequest, res: Response) => {
  const FLAG = "APPROVE_BIRTH_APPLICATION";
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid application id",
        data: null,
      });
    }

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const application = await db
      .update(birthApplications)
      .set({
        status: "APPROVED",
        approvedBy: userId,
        approvedAt: new Date(),
      })
      .where(eq(birthApplications.id, id))
      .returning({
        id: birthApplications.id,
      });

    if (!application) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Application not found",
        data: null,
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `[${FLAG}] - Application with ID: ${id} approved successfully`,
      data: application,
    });
  } catch (error: any) {
    logger.error(
      `[${FLAG}] An error occurred while approving application: ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while approving application",
      data: null,
    });
  }
};
