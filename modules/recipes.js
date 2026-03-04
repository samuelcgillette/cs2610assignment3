import pool from "../utils/db.js";

export async function getAllRecipes() {
    const result = await pool.query("SELECT * FROM recipes ORDER BY created_at DESC");
    return result.rows;
}

export async function getRecipeById(id) {
    const result = await pool.query("SELECT * FROM recipes WHERE id = $1", [id]);
    if (result.rows.length === 0) {
        return null;
    } else {
        return result.rows[0];
    }
}

export async function createRecipe(req) {
    const { title, description, ingredients, instructions, prep_time, cook_time, servings } = req.body;
    await pool.query(
        "INSERT INTO recipes (title, description, ingredients, instructions, prep_time, cook_time, servings) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [title, description, ingredients, instructions, prep_time, cook_time, servings]
    );
}

export async function updateRecipe(id, req) {
    const { title, description, ingredients, instructions, prep_time, cook_time, servings } = req.body;
    const result = await pool.query(
        "UPDATE recipes SET title = $1, description = $2, ingredients = $3, instructions = $4, prep_time = $5, cook_time = $6, servings = $7 WHERE id = $8 returning *",
        [title, description, ingredients, instructions, prep_time, cook_time, servings, id]
    );
}

export async function deleteRecipe(id) {
    await pool.query("DELETE FROM recipes WHERE id = $1", [id]);
}

export async function rateRecipe(recipeId, userId, rating) {
    await pool.query("INSERT INTO ratings (recipe_id, user_id, rating) VALUES ($1, $2, $3)",
    [recipeId, userId, rating]);
}

export async function favoriteRecipe(recipeId, userId) {
    await pool.query("INSERT INTO favorites (recipe_id, user_id) VALUES ($1, $2)",
    [recipeId, userId]
    )
}

export async function getUserRecipes(userId) {
    const result = await pool.query("SELECT * FROM recipes WHERE user_id = $1", [userId]);
    return result.rows;
}