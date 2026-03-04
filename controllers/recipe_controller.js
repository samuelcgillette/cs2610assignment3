import { Router } from "express";
import pool from "../utils/db.js";
import { requireAuth } from "../middleware/require_auth.js";
import { getAllRecipes, getRecipeById, createRecipe, updateRecipe, favoriteRecipe, deleteRecipe, rateRecipe, getUserRecipes } from "../modules/recipes.js";

const router = Router();

router.get("/", async (req, res) => {
    const recipes = await getAllRecipes();
    res.render("recipes/index", { title: "All Recipes", recipes: recipes, user: req.user, authenticated: req.authenticated });
});

router.get("/:id", async (req, res) => {
    const recipe = await getRecipeById(req.params.id);
    if (!recipe) {
        res.status(404).send("Recipe not found");
        return;
    }
    res.render("recipes/show", { title: recipe.title, recipe: recipe, user: req.user, authenticated: req.authenticated });
});

router.get("/new", requireAuth, (req, res) => {
    res.render("recipes/new", { title: "New Recipe" });
});

router.post("/", requireAuth, async (req, res) => {
    await createRecipe(req);
    res.redirect("/recipes")
});

router.get("/recipes/:id/edit", requireAuth, async (req,res) => {
    res.render("recipes/edit", {title: "edit recipe"});
})

router.post("/recipes/:id", requireAuth, async (req,res) => {
    const id = req.params.id;
    await updateRecipe(id, req);
    res.redirect(`/recipes/${id}`);
})

router.post("/recipes/:id/delete", requireAuth, async (req,res) => {
    await deleteRecipe(req.params.id);
    res.redirect("/recipes");
});

router.post("/recipes/:id/rate", requireAuth, async (req,res) => {
    const { rating } = req.body;
    await rateRecipe(req.params.id, req.user.id, rating);
});

router.post("/recipes/:id/favorite", requireAuth, async (req,res) => {
    await favoriteRecipe(req.params.id, req.user.id);
})

router.get("/my-recipes", requireAuth, async (req,res) => {
    res.render("recipes/my_recipes", { title: "My Recipes", recipes: await getUserRecipes(req.user.id) });
});



export default router;