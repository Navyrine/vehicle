CREATE TABLE IF NOT EXISTS vehicle(
    vehicle_id TEXT NOT NULL PRIMARY KEY,
    name TEXT,
    make INT,
    model TEXT,
    year INT,
    mileage TEXT,
    price NUMERIC,
    condition TEXT,
    transmission TEXT,
    fuel_type TEXT,
    color TEXT,
    location TEXT,
    status vehicle_status,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)