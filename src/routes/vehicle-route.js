import express from "express";

import { idempotencyMiddleware } from "../middlewares/idempotency-middleware.js";
import {
  presentVehicle,
  presentVehicleById,
  presentSearchVehicleByMakePriceYearFuel,
  presentVehicleByFuelType,
  newVehicle,
  editVehicle,
  eraseVehicleData,
} from "../controllers/vehicle-controller.js";

export const vehicleRouter = express.Router();

vehicleRouter.get("/listings", presentVehicle);
vehicleRouter.get("/filters", presentVehicleByFuelType);
vehicleRouter.get("/listings/search", presentSearchVehicleByMakePriceYearFuel);
vehicleRouter.get("/listings/:vehicle_id", presentVehicleById);
vehicleRouter.post("/listings", idempotencyMiddleware, newVehicle);
vehicleRouter.patch("/listings/:vehicle_id", editVehicle);
vehicleRouter.delete("/listings/:vehicle_id", eraseVehicleData);
