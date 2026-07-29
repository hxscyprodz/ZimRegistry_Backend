import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const mandatoryEnvironmentVariables = ["PORT", "APP_ENV"];

const missingEnvironmentVariables = mandatoryEnvironmentVariables.filter(
  (variable) => !process.env[variable],
);

if (missingEnvironmentVariables.length > 0) {
  const missingEnvString = JSON.stringify(missingEnvironmentVariables);
  console.error(
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
};
