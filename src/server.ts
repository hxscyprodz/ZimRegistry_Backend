import { createServer } from "node:http";
import express from "express";
import { Server, Socket } from "socket.io";
import { notFoundMiddleware } from "./middleware/not-found";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "../src/config/envConfig";
import { connectRedis, redisClient } from "./services/redis";
import logger from "../src/services/logger";
import { connectDB } from "./config/db";
import { errorHandlerMiddleware } from "./controllers/error.controller";
import authRoutes from "./routes/auth.routes";

const app = express();
const port = config.PORT;
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

//routes
app.use("/api/v1/auth", authRoutes);

io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);
});

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

export const startServer = async () => {
  try {
    await connectRedis();
    await connectDB();
    server.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error: any) {
    logger.error(error.message);
  }
};
