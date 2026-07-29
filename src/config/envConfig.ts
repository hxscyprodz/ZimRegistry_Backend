import dotenv from "dotenv";
import path from "path";
import logger from "../services/logger";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const mandatoryEnvironmentVariables = [
  "PORT",
  "APP_ENV",
  "POSTGRESQL_USERNAME",
  "POSTGRESQL_PASSWORD",
  "POSTGRESQL_HOST",
  "POSTGRESQL_DB",
  "POSTGRESQL_PORT",
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
  POSTGRESQL_USERNAME: process.env.POSTGRESQL_USERNAME as string,
  POSTGRESQL_PASSWORD: process.env.POSTGRESQL_PASSWORD as string,
  POSTGRESQL_HOST: process.env.POSTGRESQL_HOST as string,
  POSTGRESQL_DB: process.env.POSTGRESQL_DB as string,
  POSTGRESQL_PORT: Number(process.env.POSTGRESQL_PORT) || 5432,
};
