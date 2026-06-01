import crypto from "crypto";

export const hashRequest = (body) => {
  return crypto.createHash("sha256").update(JSON.stringify(body)).digest("hex");
};
