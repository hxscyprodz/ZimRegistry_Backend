import path from "path";
import dotenv from "dotenv";
import logger from "../services/logger";

dotenv.config({ path: path.join(__dirname, '../../.env')});

const mandatoryVariables = [
    "PORT",
    "APP_ENV",
    "JWT_ACCESS_TOKEN",
    "JWT_REFRESH_TOKEN",
    "MONGODB_URL"
];

const missingVariables = mandatoryVariables.filter((variable) => !process.env[variable]);

if(missingVariables.length > 0) {
    const variableString = JSON.stringify(missingVariables);
    logger.error(`Environment variable(s) ${variableString.substring(1, variableString.length - 1)} are required to start the server.
    
    If running on local machine create a .env file in your route directory and define them there.
    `);

    process.exit(1);
    
};


const config = {
    PORT: process.env.PORT,
    APP_ENV: process.env.APP_ENV,
    JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN,
    JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN,
    MONGODB_URL: process.env.MONGODB_URL
};

export default config;
