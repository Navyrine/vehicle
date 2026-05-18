import Joi from "joi";

export const addVehicleValidation = Joi.object({
  name: Joi.string().trim().required(),
  make: Joi.number().trim().required(),
  model: Joi.string().trim().required(),
  year: Joi.number().trim().required(),
  mileage: Joi.string().trim().required(),
  price: Joi.number().trim().required(),
  condition: Joi.string().trim().required(),
  transmission: Joi.string().trim().required(),
  fuel_type: Joi.string().trim().required(),
  color: Joi.string().trim().required(),
  location: Joi.string().trim().required(),
  status: Joi.string().trim().lowercase().required(),
});

export const updateVehicleValidation = Joi.object({
  name: Joi.string().trim(),
  make: Joi.number().trim(),
  model: Joi.string().trim(),
  year: Joi.number().trim(),
  mileage: Joi.string().trim(),
  price: Joi.number().trim(),
  condition: Joi.string().trim(),
  transmission: Joi.string().trim(),
  fuel_type: Joi.string().trim(),
  color: Joi.string().trim(),
  location: Joi.string().trim(),
  status: Joi.string().trim().lowercase(),
});
