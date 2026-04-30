import application from "./application";
import config from "./config/env.config";
import logger from "./services/logger";
import connectDB from "./config/db.config";

const port = config.PORT || 3000;

const startServer = async() => {
    try{
        await connectDB();
        application.listen(port, () => logger.info(`Server running on port ${port}...`));
    }catch(error: any) {
        logger.error(`ERROR : ${error?.message}`);
    };
};

startServer();