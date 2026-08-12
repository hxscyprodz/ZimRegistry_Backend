import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import logger from "../services/logger";
import { config } from "./envConfig";
import * as schema from "../db/schemas";

const FLAG = "DATABASE";

export const pool = new Pool({
  connectionString: config.POSTGRESQL_URL,
});

export const db = drizzle({ client: pool, schema });

export const connectDB = async () => {
  try {
    await pool.connect();
    logger.info(`[${FLAG}] - Connected to the database successfully!`);
  } catch (error: any) {
    logger.error(
      `[${FLAG}] - An error occured while connecting to the database: ${error.message}`,
    );
    process.exit(1);
  }
};
