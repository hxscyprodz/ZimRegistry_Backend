import bcrypt from "bcryptjs";
import logger from "../services/logger";

export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error: any) {
    logger.error(`Error occurred while hashing password: ${error?.message}`);
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error: any) {
    logger.error(`Error occurred while comparing password: ${error?.message}`);
  }
};
