import Joi from "joi";

export const addVehicleValidation = Joi.object({
  idempotency_key: Joi.string().required(),
  name: Joi.string().trim().required(),
  make: Joi.string().trim().required(),
  model: Joi.string().trim().required(),
  year: Joi.number().required(),
  mileage: Joi.string().trim().required(),
  price: Joi.number().required(),
  condition: Joi.string().trim().required(),
  transmission: Joi.string().trim().required(),
  fuel_type: Joi.string().trim().required(),
  color: Joi.string().trim().required(),
  location: Joi.string().trim().required(),
  status: Joi.string().trim().lowercase().required(),
});

export const updateVehicleValidation = Joi.object({
  name: Joi.string().trim(),
  make: Joi.string().trim(),
  model: Joi.string().trim(),
  year: Joi.number(),
  mileage: Joi.string().trim(),
  price: Joi.number(),
  condition: Joi.string().trim(),
  transmission: Joi.string().trim(),
  fuel_type: Joi.string().trim(),
  color: Joi.string().trim(),
  location: Joi.string().trim(),
  status: Joi.string().trim().lowercase(),
});
