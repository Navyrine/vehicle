CREATE INDEX idx_vehicle_model_trgm
ON vehicle USING gin (model gin_trgm_ops);