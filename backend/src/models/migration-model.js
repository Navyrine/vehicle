// MAIN QUERY
export const getFileName = async (db) => {
  const query = await db.query("SELECT filename FROM migration");
  const result = query.rows;

  return result;
};

export const createMigration = async (db) => {
  await db.query(`
        CREATE TABLE IF NOT EXISTS migration
        (
            migration_id TEXT NOT NULL PRIMARY KEY,
            filename TEXT UNIQUE NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )    
    `);
};

export const insertFilename = async (db, migrationId, filename) => {
  await db.query(
    "INSERT INTO migration (migration_id, filename) VALUES ($1, $2)",
    [migrationId, filename],
  );
};
