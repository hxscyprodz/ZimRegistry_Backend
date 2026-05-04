import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/user.routes";
import birthRoutes from "./routes/birth.routes";

const application = express();

application.use(express.json());
application.use(express.urlencoded({ extended: true }));
application.use(morgan("combined"));

//routes
application.use("/api/v1/account", userRoutes);
application.use("/api/v1/birth", birthRoutes);

export default application;