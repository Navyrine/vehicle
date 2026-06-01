CREATE TABLE IF NOT EXISTS idempotency(
    idempotency_id TEXT NOT NULL PRIMARY KEY,
    idempotency_key TEXT UNIQUE NOT NULL,
    request_hash TEXT,
    response_body JSONB,
    status_code INT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)