import { Request, Response } from "express";
import { db } from "../../config/db";
import { users } from "../../db/schemas";
import { AuthRequest } from "../../types";
import { eq } from "drizzle-orm";
import { nationalIdApplications, birthApplications } from "../../db/schemas";
import { StatusCodes } from "http-status-codes";
import logger from "../../services/logger";
import { unionAll } from "drizzle-orm/pg-core";

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

    const applicationType = trackingId.startsWith("BC") ? "birth" : "id";

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

export const getApplications = async (req: AuthRequest, res: Response) => {
  const FLAG = "GET_APPLICATIONS";
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const userApplications = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {},
      with: {
        birthApplications: {
          columns: {
            trackingId: true,
            status: true,
            createdAt: true,
          },
        },
        nationalIdApplications: {
          columns: {
            trackingId: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!userApplications) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User account not found",
        data: null,
      });
    }

    const applications = [
      ...userApplications.birthApplications.map((app) => ({
        ...app,
        type: "BIRTH",
      })),
      ...userApplications.nationalIdApplications.map((app) => ({
        ...app,
        type: "NATIONAL_ID",
      })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const stats = [
      ...userApplications.birthApplications,
      ...userApplications.nationalIdApplications,
    ].reduce(
      (acc, app) => {
        switch (app.status) {
          case "PENDING":
            acc.pending++;
            break;
          case "APPROVED":
            acc.approved++;
            break;
          case "REJECTED":
            acc.rejected++;
            break;
        }
        return acc;
      },
      {
        pending: 0,
        approved: 0,
        rejected: 0,
      },
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Applications fetched successfully",
      data: {
        applications,
        stats,
      },
    });
  } catch (error: any) {
    logger.error(
      `[${FLAG}] - An error occurred while fetching applications: ${error.message}`,
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching applications",
      data: null,
    });
  }
};
