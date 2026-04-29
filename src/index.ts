import application from "./application";

const port = 3000;

const startServer = async() => {
    try{
        application.listen(port, () => console.log(`Server running on port ${port}...`));
    }catch(error: any) {
        console.log(error)
    };
};

startServer();