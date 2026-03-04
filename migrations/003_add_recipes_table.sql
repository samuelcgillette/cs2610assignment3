CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    prep_time INT CHECK (prep_time >= 0 AND prep_time <= 59) NOT NULL,
    cook_time INT CHECK (cook_time >= 0 AND cook_time <= 59) NOT NULL,
    servings INT CHECK (servings > 0) NOT NULL,
    user_id INT REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
    
);