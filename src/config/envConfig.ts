import dotenv from "dotenv";
import path from "path";
import logger from "../services/logger";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const mandatoryEnvironmentVariables = [
  "PORT",
  "APP_ENV",
  "POSTGRESQL_URL",
  "REDIS_URL",
];

const missingEnvironmentVariables = mandatoryEnvironmentVariables.filter(
  (variable) => !process.env[variable],
);

if (missingEnvironmentVariables.length > 0) {
  const missingEnvString = JSON.stringify(missingEnvironmentVariables);
  logger.error(
    `Missing environment variables: ${missingEnvString.substring(
      1,
      missingEnvString.length - 1,
    )} which are needed to start the server`,
  );
  process.exit(1);
}

export const config = {
  PORT: Number(process.env.PORT) || 3000,
  APP_ENV: process.env.APP_ENV as string,
  POSTGRESQL_URL: process.env.POSTGRESQL_URL as string,
  REDIS_URL: process.env.REDIS_URL as string,
};
