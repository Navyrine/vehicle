import { pool } from "../config/database.js";
import { hashRequest } from "../utils/hash.js";
import { ResponseError } from "../error/ResponseError.js";
import {
  findByKey,
  createKey,
  saveResponse,
} from "../models/idempotency-model.js";

export const idempotencyMiddleware = async (req, res, next) => {
  const key = req.headers["idempotency-key"];

  if (!key) {
    return next(new ResponseError(400, "Idempotency-key required"));
  }

  const requestHash = hashRequest(req.body);

  try {
    const existing = await findByKey(pool, key);

    if (existing) {
      if (existing.request_hash !== requestHash) {
        return next(
          new ResponseError(409, "Request conflict (different payload)"),
        );
      }

      if (existing.response_body) {
        return res.status(existing.status_code).json(existing.response_body);
      }

      return next(new ResponseError(409, "Request still processing"));
    }

    const uuid = crypto.randomUUID();

    await createKey(pool, uuid, key, requestHash);

    req.idempotencyKey = key;

    next();
  } catch (err) {
    next(err);
  }
};
