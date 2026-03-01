CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT now(),

)