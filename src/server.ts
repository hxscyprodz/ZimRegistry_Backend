import { createServer } from "node:http";
import express from "express";
import { Server, Socket } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "../src/config/envConfig";

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

export const startServer = async () => {
  try {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error: any) {
    console.log(error.message);
  }
};
