import { TBirthApplication } from "../types";
import { redisClient } from "../services/redis";
import logger from "../services/logger";

export const generateTrackId = async(applicationType: TBirthApplication) => {
  const year = new Date().getFullYear();
  const redisKey = `${applicationType}_counter:${year}`;
  try {
    const nextSequence = await redisClient.incr(redisKey);
    const paddedSequence = String(nextSequence).padStart(7, "0");
    return `${applicationType}-${year}-${paddedSequence}`;
  } catch (error: any) {
    logger.error(
      `An error occurred while generating [ ${applicationType}] track id`,
    );
    throw new Error(`Could not generate [ ${applicationType}] track id`);
  }
};
