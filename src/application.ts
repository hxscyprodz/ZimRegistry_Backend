import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/user.routes";

const application = express();

application.use(express.json());
application.use(express.urlencoded({ extended: true }));
application.use(morgan("combined"));

//routes
application.use("/api/v1/account", userRoutes);

export default application;