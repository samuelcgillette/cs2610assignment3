CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    recipe_id INT REFERENCES recipes(id) NOT NULL,
    user_id INT REFERENCES users(id) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE (recipe_id, user_id)
)