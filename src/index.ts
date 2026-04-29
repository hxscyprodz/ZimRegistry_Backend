import application from "./application";
import config from "./config/env.config";
import logger from "./services/logger";

const port = config.PORT || 3000;

const startServer = async() => {
    try{
        application.listen(port, () => logger.info(`Server running on port ${port}...`));
    }catch(error: any) {
        logger.error(`ERROR : ${error?.message}`);
    };
};

startServer();