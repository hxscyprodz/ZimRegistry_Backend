import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import logger from "../services/logger";
import { config } from "./envConfig";

const {
  POSTGRESQL_DB,
  POSTGRESQL_HOST,
  POSTGRESQL_PASSWORD,
  POSTGRESQL_PORT,
  POSTGRESQL_USERNAME,
} = config;

export const pool = new Pool({
  connectionString: `postgresql://${POSTGRESQL_USERNAME}:${POSTGRESQL_PASSWORD}@${POSTGRESQL_HOST}:${POSTGRESQL_PORT}/${POSTGRESQL_DB}`,
});

export const db = drizzle({ client: pool });

export const connectDB = async () => {
  try {
    await pool.connect();
    logger.info("Connected to the database successfully!");
  } catch (error: any) {
    logger.error(
      "An error occured while connecting to the database:" + error.message,
    );
    process.exit(1);
  }
};
