import { ResponseError } from "../error/ResponseError.js";

export const validation = (schema, request) => {
  const { error, value } = schema.validate(request, {
    abortEarly: true,
    convert: true,
  });

  if (error) {
    throw new ResponseError(
      400,
      error.details.map((e) => e.message).join(", "),
    );
  }

  return value;
};
