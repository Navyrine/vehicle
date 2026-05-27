import {
  showVehicle,
  showVehicleById,
  showTotalVehicle,
  showSearchVehicleByMakePriceYearFuel,
  showVehicleByFuelType,
  addVehicle,
  changeVehicle,
  removeVehicle,
} from "../services/vehicle-service.js";

export const presentVehicle = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const total = await showTotalVehicle();
    const result = await showVehicle(limit, offset);

    return res.status(200).json({
      status_code: 200,
      page,
      limit,
      total_data: parseInt(total.count),
      total_page: Math.ceil(total.count / limit),
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const presentVehicleById = async (req, res, next) => {
  try {
    let vehicleId = String(req.params.vehicle_id);
    const result = await showVehicleById(vehicleId);

    return res.status(200).json({
      status_code: 200,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const presentSearchVehicleByMakePriceYearFuel = async (
  req,
  res,
  next,
) => {
  try {
    let makeFuelType = req.query.make_fuel_type || null;
    let price = req.query.price ? parseInt(req.query.price) : 0;
    let year = req.query.year ? parseInt(req.query.year) : 0;
    const result = await showSearchVehicleByMakePriceYearFuel(
      makeFuelType,
      price,
      year,
    );

    return res.status(200).json({
      status_code: 200,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const presentVehicleByFuelType = async (req, res, next) => {
  try {
    let fuelType = String(req.query.fuel_type);
    const result = await showVehicleByFuelType(fuelType);

    return res.status(200).json({
      status_code: 200,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const newVehicle = async (req, res, next) => {
  try {
    const idempotencyKey = req.get("idempotency-key");
    const body = req.body;

    await addVehicle(body, idempotencyKey);

    return res.status(201).json({
      status_code: 201,
      message: "Success added vehicle data",
    });
  } catch (err) {
    next(err);
  }
};

export const editVehicle = async (req, res, next) => {
  try {
    let vehicleId = String(req.params.vehicle_id);
    const body = req.body;

    await changeVehicle(body, vehicleId);

    return res.status(200).json({
      status_code: 200,
      message: "Success updated vehicle data",
    });
  } catch (err) {
    next(err);
  }
};

export const eraseVehicleData = async (req, res, next) => {
  try {
    let vehicleId = String(req.params.vehicle_id);

    await removeVehicle(vehicleId);

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
