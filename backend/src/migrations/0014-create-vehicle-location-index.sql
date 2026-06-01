CREATE INDEX idx_vehicle_location_trgm
ON vehicle USING gin (location gin_trgm_ops);