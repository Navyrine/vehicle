import { pool } from "../config/database.js";
import { ResponseError } from "../error/ResponseError.js";
import { hashRequest } from "../utils/hash.js";
import { findByKey, createKey } from "../models/idempotency-model.js";

export const idempotencyMiddleware = async (req, res, next) => {
  try {
    const idempotencyKey = req.headers["idempotency-key"];
    if (!idempotencyKey) {
      throw new ResponseError(400, "Idempotency key required");
    }

    const requestHash = hashRequest(req.body);
    const uuid = crypto.randomUUID();
    let existingKey = await findByKey(pool, idempotencyKey);

    if (existingKey) {
      if (existingKey.request_hash !== requestHash) {
        throw new ResponseError(
          409,
          "Idempotency key use with different response",
        );
      }

      if (existingKey.status === "processing") {
        throw new ResponseError(409, "Request still procressing");
      }

      return res
        .status(existingKey.status_code)
        .json(existingKey.response_body);
    }

    try {
      await createKey(pool, uuid, idempotencyKey, requestHash);
    } catch (err) {
      if (err.code === "23505") {
        existingKey = await findByKey(pool, idempotencyKey);

        if (existingKey.request_hash !== requestHash) {
          throw new ResponseError(409, "Idempotency key conflict");
        }

        if (existingKey.status === "processing") {
          throw new ResponseError(409, "Request still processing");
        }

        return res
          .status(existingKey.status_code)
          .json(existingKey.response_body);
      }

      throw err;
    }

    req.idempotencyKey = idempotencyKey;

    next();
  } catch (err) {
    next(err);
  }
};
