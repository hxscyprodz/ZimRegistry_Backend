import { connect, connection } from "mongoose";
import config from "./envConfig";
import logger from "../services/logger";

const {
  MONGODB_PASSWORD,
  MONGODB_USERNAME,
  MONGOD_HOST,
  MONGODB_CONNECTION_RETRY_DELAY,
  MONGODB_MAX_RETRIES,
} = config;
const FLAG = "DATABASE";

export const connectDatabase = async (attempt = 1) => {
  try {
    const connectionString = `mongodb://127.0.0.1/zimregistry`;
    const response = await connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info(`[ ${FLAG} ] - Database connected successfully...`);
    return response;
  } catch (error) {
    if (attempt > Number(MONGODB_MAX_RETRIES)) {
      process.exit(1);
    } else {
      logger.error(`[ ${FLAG} ] : Failed to connect to database - ${error}`);
      await new Promise((resolve) =>
        setTimeout(resolve, MONGODB_CONNECTION_RETRY_DELAY),
      );
      connectDatabase();
    }
  }
};

connection.on("disconnected", () => {
  logger.warn(
    `[ ${FLAG} ] : MongoDB Database disconnected and waiting for live queries to reconnect...`,
  );
});

connection.on("error", (error) => {
  logger.error(`[ ${FLAG} ] : Post-connection error, ${error}`);
});
