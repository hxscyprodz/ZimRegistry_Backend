import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../../types";
import { birthApplicationSchema } from "../../validators/validators";
import { db } from "../../config/db";
import { birthApplications, birthCertificates } from "../../db/schemas";
import { inArray } from "drizzle-orm";
import { generateTrackId } from "../../utils/trackId";
import logger from "../../services/logger";

export const createApplication = async (req: AuthRequest, res: Response) => {
  const FLAG = "BIRTH_APPLICATION";
  try {
    const isRequestValid = birthApplicationSchema.safeParse(req.body);
    if (!isRequestValid.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
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
        status: false,
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
      status: true,
      message: "Application created successfully",
      data: result,
    });
  } catch (error: any) {
    logger.error(
      `[${FLAG}] An error occurred while creating application: ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "false",
      message: "An error occurred while creating application",
      data: null,
    });
  }
};
