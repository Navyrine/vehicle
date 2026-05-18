// MAIN QUERY
export const getFileName = async (db) => {
    const query = await db.query("SELECT filename FROM migration");
    const result = query.rows;

    return result;
}

export const createMigration = async (db, migrationId) => {
    await db.query(`
        CREATE TABLE IF EXISTS migration
        (
            migration_id TEXT NOT NULL PRIMARY KEY,
            filename TEXT UNIQUE NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )    
    `)
}

export const insertFilename = async (db, filename) => {
    await db.query("INSERT INTO migration (filename) VALUES ($1)", [filename]);
}