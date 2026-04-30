import { connect } from "mongoose";
import logger from "../services/logger";
import config from "./env.config";

const connectDB = async() => {
    try{
        await connect(config.MONGODB_URL || "");
        logger.info("[ DATABASE ]: Database connected successfully...");
    } catch(error: any) {
        logger.error('[ DATABASE ]:Database connection failed...');
    };
};

export default connectDB;