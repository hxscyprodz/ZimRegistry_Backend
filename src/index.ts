import application from "./application";
import config from "./config/env.config";

const port = config.PORT || 3000;

const startServer = async() => {
    try{
        application.listen(port, () => console.log(`Server running on port ${port}...`));
    }catch(error: any) {
        console.log(error)
    };
};

startServer();