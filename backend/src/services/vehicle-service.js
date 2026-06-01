import dayjs from "dayjs";

import { pool } from "../config/database.js";
import { ResponseError } from "../error/ResponseError.js";
import { validation } from "../validations/validator.js";
import { saveResponse } from "../models/idempotency-model.js";
import {
  addVehicleValidation,
  updateVehicleValidation,
} from "../validations/vehicle-validation.js";
import {
  getVehicle,
  getVehicleById,
  getTotalVehicle,
  getVehicleByFuelType,
  searchVehicleByMakePriceYearFuel,
  getVehicleByMakeModelLocation,
  insertVehicle,
  updateVehicle,
  deleteVehicle,
} from "../models/vehicle-model.js";

export const showVehicle = async (limit, offset) => {
  const result = await getVehicle(pool, limit, offset);
  if (result.length === 0) {
    throw new ResponseError(404, "Vehicle data not found");
  }

  return result;
};

export const showVehicleById = async (vehicleId) => {
  vehicleId = vehicleId.toLowerCase().trim();

  const result = await getVehicleById(pool, vehicleId);
  if (!result) {
    throw new ResponseError(404, "Vehicle data not found");
  }

  return result;
};

export const showTotalVehicle = async () => {
  const result = await getTotalVehicle(pool);
  if (!result) {
    throw new ResponseError(404, "Vehicle data not found");
  }

  return result;
};

export const showSearchVehicleByMakePriceYearFuel = async (
  makeFuelType,
  price,
  year,
) => {
  makeFuelType = makeFuelType ? makeFuelType.toLowerCase().trim() : null;

  const result = await searchVehicleByMakePriceYearFuel(
    pool,
    makeFuelType,
    price,
    year,
  );
  if (result.length === 0) {
    throw new ResponseError(404, "Vehicle data not found");
  }

  return result;
};

export const showVehicleByFuelType = async (fuelType) => {
  fuelType = fuelType.toLowerCase().trim();

  const result = await getVehicleByFuelType(pool, fuelType);
  if (result.length === 0) {
    throw new ResponseError(404, "Vehicle data not found");
  }

  return result;
};

export const showVehicleByMakeModelLocation = async (parameter) => {
  parameter = parameter.toLowerCase().trim();

  const result = await getVehicleByMakeModelLocation(pool, parameter);
  if (result.length === 0) {
    return [];
  }

  return result;
};

export const addVehicle = async (request, idempotencyKey) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const vehicle = validation(addVehicleValidation, request);
    const uuid = crypto.randomUUID();

    await insertVehicle(
      client,
      uuid,
      vehicle.name,
      vehicle.make,
      vehicle.model,
      vehicle.year,
      vehicle.mileage,
      vehicle.price,
      vehicle.condition,
      vehicle.transmission,
      vehicle.fuel_type,
      vehicle.color,
      vehicle.location,
      vehicle.status,
    );

    await saveResponse(
      client,
      { status_code: 201, message: "Success added vehicle data" },
      201,
      "completed",
      idempotencyKey,
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const changeVehicle = async (request, vehicleId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const vehicle = validation(updateVehicleValidation, request);
    const existingVehicle = await getVehicleById(client, vehicleId);

    if (!existingVehicle) {
      throw new ResponseError(404, "Vehicle data not found");
    }

    const date = dayjs();
    const formattedDate = date.format("YYYY-MM-DD HH:mm:ss");
    const data = {
      name: vehicle.name ?? existingVehicle.name,
      make: vehicle.make ?? existingVehicle.make,
      model: vehicle.model ?? existingVehicle.model,
      year: vehicle.year ?? existingVehicle.year,
      mileage: vehicle.mileage ?? existingVehicle.mileage,
      price: vehicle.price ?? existingVehicle.price,
      condition: vehicle.condition ?? existingVehicle.condition,
      transmission: vehicle.transmission ?? existingVehicle.transmission,
      fuel_type: vehicle.fuel_type ?? existingVehicle.fuel_type,
      color: vehicle.color ?? existingVehicle.color,
      location: vehicle.location ?? existingVehicle.location,
      status: vehicle.status ?? existingVehicle.status,
      update_at: formattedDate,
    };

    await updateVehicle(client, data, vehicleId);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const removeVehicle = async (vehicleId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingVehicle = await getVehicleById(client, vehicleId);
    if (!existingVehicle) {
      throw new ResponseError(404, "Vehicle data not found");
    }

    await deleteVehicle(client, vehicleId);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
