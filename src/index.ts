import express, { Request, Response, Application } from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { connectDatabase } from "./config/databaseConfig";
import config from "./config/envConfig";
import logger from "./services/logger";
import whatsappRoutes from "./routes/whatsapp.routes";
import authRoutes from "./routes/dashboard/auth.route";

const app: Application = express();
const server = createServer(app);
const io = new Server(server);
const port = config.PORT;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use(whatsappRoutes);
app.use("/auth", authRoutes);

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
