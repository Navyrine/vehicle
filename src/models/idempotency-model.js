export const findByKey = async (db, key) => {
  const query = await db.query(
    `
        SELECT
        idempotency_id,
        idempotency_key,
        request_hash,
        response_body,
        status_code
        FROM idempotency
        WHERE idempotency_key = $1
    `,
    [key],
  );
  const result = query.rows[0];

  return result;
};

export const createKey = async (db, key, requestHash) => {
  const query = await db.query(
    `
        INSERT INTO idempotency
        (idempotency_key, request_hash)
        VALUES
        ($1, $2)
        RETURNING *    
    `,
    [key, requestHash],
  );
  const result = query.rows;

  return result;
};

export const saveResponse = async (db, responseBody, statusCode, key) => {
  const query = await db.query(
    `
        UPDATE idempotency
        SET
        response_body = $1,
        status_code = $2
        WHERE idempotency_key = $3
        RETURNING *
    `,
    [responseBody, statusCode, key],
  );
  const result = query.rows;

  return result;
};
