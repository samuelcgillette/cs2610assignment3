CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) NOT NULL,
    recipe_id INT REFERENCES recipes(id) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE (user_id, recipe_id)
);