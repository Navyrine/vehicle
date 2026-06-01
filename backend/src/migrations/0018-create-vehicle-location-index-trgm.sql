CREATE INDEX idx_vehicle_location_trgm
ON vehicle
USING gin(LOWER(location) gin_trgm_ops);