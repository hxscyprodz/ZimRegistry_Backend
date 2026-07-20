import { Request, Response } from "express";
import NationalIdApplication from "../models/nationalId/nationalApplication.model";
import BirthCertificate from "../models/birthCertificate/birth.model";
import { StatusCodes } from "http-status-codes";
import logger from "../services/logger";
import { CustomRequest, EStatus } from "../types/types";

export const createApplication = async (req: Request, res: Response) => {};

export const getAllApplications = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const totalApplications = await NationalIdApplication.countDocuments();
    const applications = await NationalIdApplication.find()
      .sort({ applicationDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (applications.length <= 0) {
      return res.status(StatusCodes.OK).json({
        success: false,
        message: "No national ID applications in the database",
      });
    }

    const nationalIdNumbers = applications.map(
      (app) => app.nationalIdNumber,
    );

    const birthCertificates = await BirthCertificate.find({
      nationalIdNumber: { $in: nationalIdNumbers },
    }).lean();

    const birthCertsMap = new Map(
      birthCertificates.map((cert) => [cert.nationalIdNumber, cert]),
    );

    const transformedData = applications.map((application) => {
      return {
        ...application,
        birthDetails: birthCertsMap.get(application.nationalIdNumber) || null,
      };
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      data: transformedData,
      count: totalApplications,
      totalPages: Math.ceil(totalApplications / limit),
      currentPage: page,
    });
  } catch (error: any) {
    logger.error("An error occurred while fetching national ID applications");
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching national ID applications",
    });
  }
};

export const getApplication = async (req: CustomRequest, res: Response) => {
  try {
    const { applicationId } = req.params;
    const application = await NationalIdApplication.findOne({
      _id: applicationId,
    }).lean();

    if (!application) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: true,
        message: "Application not found",
      });
    }

    const birthCertificate = await BirthCertificate.findOne(
      { nationalIdNumber: application.nationalIdNumber },
      {
        firstName: 1,
        surname: 1,
        nationalIdNumber: 1,
        sex: 1,
        dateOfBirth: 1,
        placeOfBirth: 1,
      },
    ).lean();

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        ...application,
        birthDetails: birthCertificate,
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

export const approveApplication = async (req: CustomRequest, res: Response) => {
  try {
    console.log(req.user);
    const { applicationId } = req.params;
    const application = await NationalIdApplication.findOne({
      _id: applicationId,
    }).lean();

    if (!application) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.status === EStatus.APPROVED) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Application already approved",
      });
    }

    await NationalIdApplication.findOneAndUpdate(
      {
        _id: applicationId,
      },
      {
        $set: {
          status: EStatus.APPROVED,
          approvedBy: req.user.id,
          approvedDate: new Date(),
        },
      },
      {
        returnDocument: "after",
      },
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Application approved successfully",
    });
  } catch (error: any) {
    logger.error("An error occurred while approving birth application" + error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while approving",
    });
  }
};

export const rejectApplication = async (req: CustomRequest, res: Response) => {
  try {
    const { rejectionReason } = req.body;
    const { applicationId } = req.params;

    const application = await NationalIdApplication.findOne({
      _id: applicationId,
    }).lean();

    if (!application) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Application not found",
      });
    }

    await NationalIdApplication.findOneAndUpdate(
      {
        _id: applicationId,
      },
      {
        $set: {
          status: EStatus.REJECTED,
          rejectionReason,
          rejectedBy: req.user.id,
          rejectedDate: new Date(),
        },
      },
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Application rejected successfully",
    });
  } catch (error: any) {
    logger.error("An error occurred while rejecting birth application");
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while rejecting birth application",
    });
  }
};
