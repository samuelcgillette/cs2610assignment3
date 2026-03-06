import pool from "../utils/db.js";

export async function getAllRecipes() {
    const result = await pool.query("SELECT * FROM recipes ORDER BY created_at DESC");
    return result.rows;
}

export async function getRecentRecpies() {
    const result = await pool.query("SELECT * FROM recipes ORDER BY created_at DESC LIMIT 3");
    return result.rows;
}

export async function getRecipeByWord(word) {
    const result = await pool.query("SELECT * FROM recipes where title LIKE $1 OR ingredients LIKE $1", [`%${word}%`]);
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
        "INSERT INTO recipes (title, description, ingredients, instructions, prep_time, cook_time, servings, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [title, description, ingredients, instructions, prep_time, cook_time, servings, req.user.id]
    );
}

export async function updateRecipe(id, req) {
    const { title, description, ingredients, instructions, prep_time, cook_time, servings } = req.body;
    const result = await pool.query(
        "UPDATE recipes SET title = $1, description = $2, ingredients = $3, instructions = $4, prep_time = $5, cook_time = $6, servings = $7, updated_at = NOW() WHERE id = $8 returning *",
        [title, description, ingredients, instructions, prep_time, cook_time, servings, id]
    );
}

export async function deleteRecipe(id) {
    await pool.query("DELETE FROM recipes WHERE id = $1", [id]);
}

export async function rateRecipe(recipeId, userId, rating) {
    await pool.query(
        "INSERT INTO ratings (recipe_id, user_id, rating) VALUES ($1, $2, $3) ON CONFLICT (recipe_id, user_id) DO UPDATE SET rating = EXCLUDED.rating",
        [recipeId, userId, rating]
    );
}

export async function favoriteRecipe(recipeId, userId) {
    await pool.query("INSERT INTO favorites (recipe_id, user_id) VALUES ($1, $2)",
    [recipeId, userId]
    )
}

export async function unfavoriteRecipe(recipeId, userId) {
    await pool.query("DELETE FROM favorites WHERE recipe_id = $1 AND user_id = $2",
    [recipeId, userId]
    )
}

export async function isUserFavorite(recipeId, userId) {
    const result = await pool.query("SELECT * FROM favorites WHERE recipe_id = $1 AND user_id = $2", [recipeId, userId]);
    return result.rows.length > 0;
}

export async function getRatingAverage(recipeId) {
    const result = await pool.query("SELECT rating FROM ratings WHERE recipe_id = $1", [recipeId]);

    if (result.rows.length === 0) {
        return { averageRating: null, totalRatings: 0 };
    }

    let total = 0;
    for (const row of result.rows) {
        total += Number(row.rating);
    }
    return {
        averageRating: Math.round(total / result.rows.length),
        totalRatings: result.rows.length,
    };
}

export async function getUserRatingForRecipe(recipeId, userId) {
    const result = await pool.query(
        "SELECT rating FROM ratings WHERE recipe_id = $1 AND user_id = $2 LIMIT 1",
        [recipeId, userId]
    );

    if (result.rows.length === 0) {
        return 0;
    }

    return Number(result.rows[0].rating);
}

export async function getNumFavorites(recipeId) {
    const result = await pool.query("SELECT * FROM favorites WHERE recipe_id = $1", [recipeId]);
    return result.rows.length;
}

export async function getUserRecipes(userId) {
    const result = await pool.query("SELECT * FROM recipes WHERE user_id = $1", [userId]);
    return { recipes: result.rows, numRecipes: result.rows.length };
}

export async function getFavorites(userId) {
  const result = await pool.query(`
    SELECT recipes.*
    FROM favorites
    JOIN recipes ON favorites.recipe_id = recipes.id
    WHERE favorites.user_id = $1
  `, [userId]);
  return result.rows;
}

export function isOwner(recipe, user) {
    try {
        return recipe.user_id === user.id;
    } catch (e) {
        return false;
    }
}