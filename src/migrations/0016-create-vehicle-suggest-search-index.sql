CREATE INDEX idx_vehicle_suggest_search_trgm
ON vehicle
USING gin (
  (
    LOWER(TRIM(make || ' ' || model || ' ' || location))
  ) gin_trgm_ops
);