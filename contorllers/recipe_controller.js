import { Router } from "express";
import pool from "../utils/db.js";

const router = Router();

// display all recipes
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
        res.render("recipes/show", { title: result.rows[0].name, recipe: result.rows[0] });
    }
});

router.get("/new", (req, res) => {
    res.render("recipes/new", { title: "New Recipe" });
});

router.post("/", async (req, res) => {
    const { title, description, ingredients, instructions, prep_time, cook_time, servings } = req.body;
    await pool.query(
        "INSERT INTO recipes (title, description, ingredients, instructions, prep_time, cook_time, servings) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [title, description, ingredients, instructions, prep_time, cook_time, servings]
    );
    res.redirect("/recipies")
});

router.get("/recipes/:id/edit", async (req,res) => {
    res.render("recipes/edit", {title: "edit recipie"});
})

router.post("/recipes/:id/edit", async (req,res) => {
    const id = req.params.id;
    const { title, description, ingredients, instructions, prep_time, cook_time, servings } = req.body;
    const result = await pool.query(
        "UPDATE recipes SET title = $1, description = $2, ingredients = $3, instructions = $4, prep_time = $5, cook_time = $6, servings = $7 WHERE id = $8 returning *",
        [title, description, ingredients, instructions, prep_time, cook_time, servings, id]
    );
    res.redirect(`/recipes/${id}`);
})



export default router;