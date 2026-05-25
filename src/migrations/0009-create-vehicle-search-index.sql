CREATE INDEX idx_vehicle_search
ON vehicle
USING GIN (
    to_tsvector('simple', coalesce(make, '') || ' ' || coalesce(fuel_type, ''))
);