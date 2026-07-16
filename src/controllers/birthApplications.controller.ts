import { Request, Response } from "express";
import logger from "../services/logger";
import { StatusCodes } from "http-status-codes";
import BirthApplication from "../models/birthCertificate/birthApplication";
import BirthCertificate from "../models/birthCertificate/birth.model";
import Hospital from "../models/hospital.model";
import { CustomRequest, EStatus, IBirthApplication } from "../types/types";
import { Types } from "mongoose";

export const createApplication = async (req: Request, res: Response) => {};

export const getApplication = async (req: Request, res: Response) => {
  const { applicationId } = req.params;
  try {
    let application = await BirthApplication.findOne({
      _id: applicationId,
    }).lean();

    if (!application) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: true,
        message: "Application not found",
      });
    }

    const birthCertificates = await BirthCertificate.find(
      {
        _id: {
          $in: [
            new Types.ObjectId(application.motherIdNumber),
            new Types.ObjectId(application.fatherIdNumber),
          ],
        },
      },
      { _id: 1, firstName: 1, surname: 1, nationalIdNumber: 1, sex: 1 },
    ).sort({ sex: 1 });

    const hospital = await Hospital.findOne({
      _id: application.hospitalOfBirthId,
    }).lean();

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        ...application,
        hospitalOfBirth: hospital?.hospitalName,
        mother: birthCertificates[0],
        father: birthCertificates[1],
      },
    });
  } catch (error: any) {
    logger.error("An error occurred while fetching birth application");
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching application",
    });
  }
};

export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const applications = await BirthApplication.find().lean();
    if (applications.length === 0) {
      return res.status(StatusCodes.OK).json({
        success: false,
        message: "No birth applications in the database",
      });
    }

    const birthCertificates = await BirthCertificate.find(
      {},
      { _id: 1, firstName: 1, surname: 1, nationalIdNumber: 1 },
    ).lean();

    interface IBirthApplicationResponse extends IBirthApplication {
      mother: any;
      father: any;
    }

    let transformedData: IBirthApplicationResponse[] = [];

    applications.forEach((application) => {
      transformedData.push({
        ...application,
        mother: birthCertificates.find(
          (certificate) =>
            certificate._id.toString() === application.motherIdNumber,
        ),
        father: birthCertificates.find(
          (certificate) =>
            certificate._id.toString() === application.fatherIdNumber,
        ),
      });
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      data: transformedData,
      count: applications.length,
    });
  } catch (error: any) {
    logger.error("An error occurred while fetching birth applications");
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching birth applications",
    });
  }
};

export const approveApplication = async (req: CustomRequest, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { id } = req.user;
    const application = await BirthApplication.findOne({
      _id: applicationId,
    }).lean();

    if (!application) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Birth application not found",
      });
    }

    if (application.status === EStatus.APPROVED) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Birth application already approved",
      });
    }

    const updatesApplication = {
      status: EStatus.APPROVED,
      approvedBy: id,
      approvedDate: new Date(),
    };

    await BirthApplication.updateOne(
      { _id: applicationId },
      updatesApplication,
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Birth application approved successfully",
    });
  } catch (error: any) {
    logger.error("An error occurred while approving birth application");
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while approving birth application",
    });
  }
};

export const rejectApplication = async (req: CustomRequest, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { rejectionReason } = req.body;
    const { id } = req.user;

    if (!applicationId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Application ID not provided",
      });
    }

    const application = await BirthApplication.findOne({
      _id: applicationId,
    }).lean();
    if (!application) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Application not found",
      });
    }

    const updatesApplication = {
      status: EStatus.REJECTED,
      rejectedBy: id,
      rejectionReason,
      rejectedDate: new Date(),
    };

    await BirthApplication.findOneAndUpdate(
      { _id: applicationId },
      updatesApplication,
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Birth application rejection successful",
    });
  } catch (error: any) {
    logger.error("An error occurred while rejecting birth application");
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while rejecting birth application",
    });
  }
};
