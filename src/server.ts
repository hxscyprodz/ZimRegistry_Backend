import { createServer } from "node:http";
import express from "express";
import { Server, Socket } from "socket.io";
import { notFoundMiddleware } from "./middleware/not-found";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "../src/config/envConfig";
import logger from "../src/services/logger";
import { connectDB } from "./config/db";

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

io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);
});

app.use(notFoundMiddleware);

export const startServer = async () => {
  try {
    await connectDB();
    server.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error: any) {
    logger.error(error.message);
  }
};
