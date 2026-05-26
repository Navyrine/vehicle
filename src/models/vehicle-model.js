export const getVehicle = async (db, limit, offset) => {
  const query = await db.query(
    `
    SELECT
    vehicle_id,
    name,
    make,
    model,
    year,
    mileage,
    price,
    condition,
    transmission,
    fuel_type,
    color,
    location,
    status
    FROM vehicle
    ORDER BY update_at DESC
    LIMIT $1 OFFSET $2    
`,
    [limit, offset],
  );
  const result = query.rows;

  return result;
};

export const getVehicleById = async (db, vehicleId) => {
  const query = await db.query(
    `
    SELECT
    vehicle_id,
    name,
    make,
    model,
    year,
    mileage,
    price,
    condition,
    transmission,
    fuel_type,
    color,
    location,
    status
    FROM vehicle
    WHERE vehicle_id = $1    
`,
    [vehicleId],
  );
  const result = query.rows[0];

  return result;
};

export const getTotalVehicle = async (db) => {
  const query = await db.query(`
        SELECT COUNT(*)
        FROM(
            SELECT
            vehicle_id,
            name,
            make,
            model,
            year,
            mileage,
            price,
            condition,
            transmission,
            fuel_type,
            color,
            location,
            status
            FROM vehicle
        )    
    `);
  const result = query.rows[0];

  return result;
};

export const searchVehicleByMakePriceYearFuel = async (
  db,
  makeFuelType,
  price,
  year,
) => {
  const query = await db.query(
    `
        SELECT
        vehicle_id,
        name,
        make,
        model,
        year,
        mileage,
        price,
        condition,
        transmission,
        fuel_type,
        color,
        location,
        status
        FROM vehicle
        WHERE 
        (
            $1 IS NULL OR $1 = '' OR 
            to_tsvector('simple', 
                coalesce(make, '') || ' ' || coalesce(fuel_type, '')
            ) @@ plainto_tsquery($1)
        ) AND
        price >= $2 AND
        year >= $3
    `,
    [makeFuelType, price, year],
  );
  const result = query.rows;

  return result;
};

export const getVehicleByFuelType = async (db, fuelType) => {
  const query = await db.query(
    `
        SELECT
        vehicle_id,
        name,
        make,
        model,
        year,
        mileage,
        price,
        condition,
        transmission,
        fuel_type,
        color,
        location,
        status
        FROM vehicle
        WHERE LOWER(TRIM(fuel_type)) = LOWER(TRIM($1))
    `,
    [fuelType],
  );
  const result = query.rows;

  return result;
};

export const insertVehicle = async (
  db,
  vehicleId,
  name,
  make,
  model,
  year,
  mileage,
  price,
  condition,
  transmission,
  fuelType,
  color,
  location,
  status,
) => {
  const query = await db.query(
    `
        INSERT INTO vehicle
        (vehicle_id, name, make, model, year, mileage, price, condition, transmission, fuel_type, color, location, status)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *    
    `,
    [
      vehicleId,
      name,
      make,
      model,
      year,
      mileage,
      price,
      condition,
      transmission,
      fuelType,
      color,
      location,
      status,
    ],
  );
  const result = query.rows[0];

  return result;
};

export const updateVehicle = async (db, data, vehicleId) => {
  const {
    name,
    make,
    model,
    year,
    mileage,
    price,
    condition,
    transmission,
    fuel_type,
    color,
    location,
    status,
    update_at,
  } = data;

  await db.query(
    `
        UPDATE vehicle
        SET
        name = $1, 
        make = $2, 
        model = $3, 
        year = $4, 
        mileage = $5, 
        price = $6, 
        condition = $7, 
        transmission = $8, 
        fuel_type = $9, 
        color = $10, 
        location = $11, 
        status = $12,
        update_at = $13
        WHERE vehicle_id = $14    
    `,
    [
      name,
      make,
      model,
      year,
      mileage,
      price,
      condition,
      transmission,
      fuelType,
      color,
      location,
      status,
      update_at,
      vehicleId,
    ],
  );
};

export const deleteVehicle = async (db, vehicleId) => {
  await db.query("DELETE FROM vehicle WHERE vehicle_id = $1", [vehicleId]);
};
