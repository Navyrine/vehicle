CREATE INDEX idx_vehicle_model_trgm
ON vehicle
USING gin(LOWER(model) gin_trgm_ops);