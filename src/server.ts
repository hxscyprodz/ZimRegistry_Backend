import { createServer } from "node:http";
import express from "express";
import { Server, Socket } from "socket.io";
import { notFoundMiddleware } from "./middleware/not-found";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "../src/config/envConfig";
import { connectRedis } from "./services/redis";
import logger from "../src/services/logger";
import { connectDB } from "./config/db";
import { errorHandlerMiddleware } from "./controllers/error.controller";
import authRoutes from "./routes/auth.routes";
import nationalIdApplicationsRoutes from "./routes/applications/nationalApp.routes";
import birthApplicationsRoutes from "./routes/applications/birthApp.routes";
import locationRoutes from "./routes/locations.routes";
import trackApplicationRoutes from "./routes/applications/app-services.routes";
import { authenticationMiddleware } from "./middleware/authentication";

const app = express();
const port = config.PORT;
const server = createServer(app);
const io = new Server(server);
const allowedOrigins = (config.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.APP_ENV === "production" ? "combined" : "dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

//routes
app.use("/api/v1/auth", authRoutes);
app.use(
  "/api/v1/id-applications",
  authenticationMiddleware,
  nationalIdApplicationsRoutes,
);
app.use(
  "/api/v1/birth-applications",
  authenticationMiddleware,
  birthApplicationsRoutes,
);
app.use("/api/v1/locations", locationRoutes);
app.use("/api/v1/applications", trackApplicationRoutes);

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
