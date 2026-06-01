CREATE INDEX idx_vehicle_make_trgm
ON vehicle USING gin (make gin_trgm_ops);