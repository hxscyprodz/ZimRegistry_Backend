import express from "express";
import morgan from "morgan";

const application = express();

application.use(morgan("combined"));

export default application;