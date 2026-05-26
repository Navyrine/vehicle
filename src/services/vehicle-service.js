import { pool } from "../config/database.js";
import { ResponseError } from "../error/ResponseError.js";
import { validation } from "../validations/validator.js";
import { hashRequest } from "../utils/hash.js";
import {
  findByKey,
  createKey,
  saveResponse,
} from "../models/idempotency-model.js";
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

export const addVehicle = async (request) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const vehicle = validation(addVehicleValidation, request);
    const uuid = crypto.randomUUID();
    const requestHash = hashRequest(vehicle);
    let existingKey = await findByKey(client, vehicle.idempotency_key);

    if (existingKey) {
      if (existingKey.request_hash !== requestHash) {
        throw new ResponseError(
          409,
          "Idempotency key use with different request",
        );
      }

      if (existingKey.status === "processing") {
        throw new ResponseError(409, "Request still procressing");
      }

      return existingKey.response_body;
    }

    try {
      await createKey(client, uuid, vehicle.idempotency_key, requestHash);
    } catch (err) {
      if (err.code === "23505") {
        existingKey = await findByKey(client, vehicle.idempotency_key);

        if (existingKey.request_hash !== requestHash) {
          throw new ResponseError(409, "Idempotency key conflict");
        }

        if (existingKey.status === "processing") {
          throw new ResponseError(409, "Request still processing");
        }

        return existingKey.response_body;
      }
      throw err;
    }

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
      vehicle.idempotency_key,
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

    const date = new Date();
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
      update_at: date.toISOString(),
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
    const existingVehicle = await getVehicleById(vehicleId);
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
