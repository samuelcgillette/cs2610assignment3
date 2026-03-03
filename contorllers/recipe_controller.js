import { Router } from "express";
import pool from "../utils/db.js";
import { requireAuth } from "../middleware/require_auth.js";


const router = Router();

router.get("/", async (req, res) => {
    const result = await pool.query("SELECT * FROM recipes ORDER BY created_at DESC");
    res.render("recipes/index", { title: "All Recipes", recipes: result.rows });
});

router.get("/:id", async (req, res) => {
    const recipeId = req.params.id;
    const result = await pool.query("SELECT * FROM recipes WHERE id = $1", [recipeId]);
    if (result.rows.length === 0) {
        res.status(404).send("Recipe not found");
    } else {
        res.render("recipes/show", { title: result.rows[0].name, recipe: result.rows[0], user: req.user, authenticated: req.authenticated });
    }
});

router.get("/new", requireAuth, (req, res) => {
    res.render("recipes/new", { title: "New Recipe" });
});

router.post("/", requireAuth, async (req, res) => {
    const { title, description, ingredients, instructions, prep_time, cook_time, servings } = req.body;
    await pool.query(
        "INSERT INTO recipes (title, description, ingredients, instructions, prep_time, cook_time, servings) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [title, description, ingredients, instructions, prep_time, cook_time, servings]
    );
    res.redirect("/recipes")
});

router.get("/recipes/:id/edit", requireAuth, async (req,res) => {
    res.render("recipes/edit", {title: "edit recipe"});
})

router.post("/recipes/:id", requireAuth, async (req,res) => {
    const id = req.params.id;
    const { title, description, ingredients, instructions, prep_time, cook_time, servings } = req.body;
    const result = await pool.query(
        "UPDATE recipes SET title = $1, description = $2, ingredients = $3, instructions = $4, prep_time = $5, cook_time = $6, servings = $7 WHERE id = $8 returning *",
        [title, description, ingredients, instructions, prep_time, cook_time, servings, id]
    );
    res.redirect(`/recipes/${id}`);
})

router.post("/recipes/:id/delete", requireAuth, async (req,res) => {
    const id = req.params.id;
    await pool.query("DELETE FROM recipes WHERE id = $1", [id]);
    res.redirect("/recipes");
});

router.post("/recipes/:id/rate", requireAuth, async (req,res) => {
    const id = req.params.id;
    const { rating } = req.body;
    await pool.query("INSERT INTO ratings (recipe_id, user_id, rating) VALUES ($1, $2, $3)",
    [id, req.user.id ,rating])

});

router.post("/recipes/:id/favorite", requireAuth, async (req,res) => {
    const id = req.params.id
    await pool.query("INSERT INTO favorites (recipe_id, user_id) VALUES ($1, $2)",
    [id,req.user.id]
    )
})




export default router;