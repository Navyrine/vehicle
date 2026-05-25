import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { requestLogger } from "./middlewares/request-logger.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";
import { vehicleRouter } from "./routes/vehicle-route.js";

export const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
  }),
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/", vehicleRouter);

app.use(errorMiddleware);
