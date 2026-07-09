import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Station from "../../models/station.model";
import Staff from "../../models/staff.model";
import { CreateStationDTO } from "../../validators/validators";
import logger from "../../services/logger";
import { CustomRequest } from "../../types/types";

const FLAG = "STATION";

export const createStation = async (req: CustomRequest, res: Response) => {
  try {
    const valid = CreateStationDTO.safeParse(req.body);
    if (!valid.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const { stationName } = req.body;

    const existingStation = await Station.findOne({ stationName });
    if (existingStation) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "Station with the same name already exists.",
      });
    }

    await Station.create({
      ...req.body,
      createdBy: req.user.id,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Station created successfully.",
    });
  } catch (error: any) {
    logger.error(`[${FLAG}] - Error adding station: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while adding the station.",
    });
  }
};

export const getAllStations = async (req: Request, res: Response) => {
  try {
    const stations = await Station.find().lean();

    const stationsWithStaffCount = await Promise.all(
      stations.map(async (station) => {
        const staffCount = await Staff.countDocuments({
          stationId: station._id.toString(),
        });
        return { ...station, numberOfStaff: staffCount };
      }),
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      data: stationsWithStaffCount,
      count: stations.length,
      message: "Stations retrieved successfully.",
    });
  } catch (error: any) {
    logger.error(`[${FLAG}] - Error getting all stations: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while retrieving stations.",
    });
  }
};

export const getStation = async (req: Request, res: Response) => {
  try {
    const station = await Station.findById(req.params.id).lean();
    if (!station) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Station not found",
      });
    }

    const staffCount = await Staff.countDocuments({
      stationId: station._id.toString(),
    });

    const stationWithStaffCount = { ...station, numberOfStaff: staffCount };

    return res.status(StatusCodes.OK).json({
      success: true,
      data: stationWithStaffCount,
      message: "Station retrieved successfully.",
    });
  } catch (error: any) {
    logger.error(`[${FLAG}] - Error getting station by ID: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while retrieving the station.",
    });
  }
};

export const updateStation = async (req: Request, res: Response) => {
  try {
    const updatedStation = await Station.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedStation) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Station not found" });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: updatedStation,
      message: "Station updated successfully.",
    });
  } catch (error: any) {
    logger.error(`[${FLAG}] - Error updating station: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while updating the station.",
    });
  }
};

export const deleteStation = async (req: Request, res: Response) => {
  try {
    const deletedStation = await Station.findByIdAndDelete(req.params.id);
    if (!deletedStation) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Station not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Station deleted successfully.",
    });
  } catch (error: any) {
    logger.error(`[${FLAG}] - Error deleting station: ${error.message}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while deleting the station.",
    });
  }
};
