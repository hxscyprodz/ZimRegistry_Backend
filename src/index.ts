import express, { Request, Response, Application } from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { connectDatabase } from "./config/databaseConfig";
import protectRoute from "./middleware/auth.middleware";
import config from "./config/envConfig";
import logger from "./services/logger";
import whatsappRoutes from "./routes/whatsapp.routes";
import authRoutes from "./routes/dashboard/auth.route";
import staffRoutes from "./routes/dashboard/staff.route";
import stationRoutes from "./routes/dashboard/station.route";

const app: Application = express();
const server = createServer(app);
const io = new Server(server);
const port = config.PORT;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use(whatsappRoutes);
app.use("/auth", authRoutes);
app.use("/staff", protectRoute, staffRoutes);
app.use("/stations", protectRoute, stationRoutes);

io.on("connection", (socket) => {
  logger.info("User connected...");
});

//health check
app.get("/health", (req: Request, res: Response) => {
  res.send("ZimRegistry Backend is running with TypeScript!");
});

const startServer = async () => {
  const FLAG = "SERVER";
  try {
    await connectDatabase();
    server.listen(port, () =>
      logger.info(`[ ${FLAG} ] - Server running on port ${port}...`),
    );
  } catch (error: any) {
    logger.error(`[ ${FLAG} ] - Error occurred: ${error?.message}`);
    process.exit(1);
  }
};

startServer();
