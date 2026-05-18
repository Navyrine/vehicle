import pg from "pg";
import fs, { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { logger } from "../logger/logger.js";
import {
  getFileName,
  createMigration,
  insertFilename,
} from "../models/migration-model.js";

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const connectDB = async () => {
  try {
    await pool.query("SELECT 1");

    logger.info("DATABASE CONNECTED");
  } catch (err) {
    throw err;
  }
};

export const createMigrationTable = async () => {
  await createMigration(pool);
};

export const getExecutedMigration = async () => {
  const result = await getFileName(pool);

  return result.map((row) => row.filename);
};

export const runMigration = async () => {
  const client = await pool.connect();

  try {
    await createMigrationTable();

    const migrationPath = path.join(__dirname, "../migrations");
    const files = await fs.readdir(migrationPath);
    const executedMigration = await getExecutedMigration();

    for (const file of files) {
      if (!executedMigration.includes(file)) {
        const filePath = path.join(migrationPath, file);
        const sql = await fs.readFile(filePath, "utf-8");
        const uuid = crypto.randomUUID();

        logger.info(`RUNNING MIGRATION FILE ${file}`);

        try {
          await client.query("BEGIN");

          await client.query(sql);
          await insertFilename(client, uuid, file);

          await client.query("COMMIT");

          logger.info(`MIGRATION FILE SUCCESS ${file}`);
        } catch (err) {
          await client.query("ROLLBACK");
          throw err;
        }
      }
    }
  } finally {
    client.release();
  }
};
