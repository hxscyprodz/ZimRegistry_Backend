// src/lib/redis.ts
import { createClient } from "redis";
import { config } from "../config/envConfig.ts";
import logger from "./logger.ts";

const FLAG = "REDIS";
const MAX_RETRIES = 5;

export const redisClient = createClient({
  url: config.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries >= MAX_RETRIES) {
        return new Error(
          `[${FLAG}] Exceeded maximum reconnect attempts (${MAX_RETRIES}).`,
        );
      }

      return Math.min(retries * 500, 3000);
    },
  },
});

redisClient.on("error", (err: Error) => {
  logger.error(`[REDIS] Connection error: ${err.message}`);

  if (err.message.includes("Exceeded maximum reconnect attempts")) {
    logger.error(
      "[APP] Shutting down application due to Redis unavailability.",
    );
    process.exit(1);
  }
});

export async function connectRedis() {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      logger.info(`[${FLAG}] Connected to Redis successfully.`);

      if (config.APP_ENV === "development") {
        await redisClient.flushDb();
        logger.warn(`[${FLAG}] Flushed Redis database.`);
      }
    }
  } catch (err) {
    logger.error(`[${FLAG}] Initial connection failed: ${err}`);
    process.exit(1);
  }
}
