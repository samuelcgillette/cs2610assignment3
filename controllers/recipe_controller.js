import { Router } from "express";
import { requireAuth } from "../middleware/require_auth.js";
import { getAllRecipes, getRecipeById, createRecipe, updateRecipe, favoriteRecipe, deleteRecipe, rateRecipe, getUserRecipes, getFavorites, getRatingAverage, getNumFavorites, isOwner } from "../modules/recipes.js";

const router = Router();

router.get("/", async (req, res) => {
    const recipes = await getAllRecipes();
    res.render("recipes/index", { title: "All Recipes", recipes: recipes, user: req.user, authenticated: req.authenticated });
});

router.get("/new", requireAuth, (req, res) => {
    res.render("recipes/new", { title: "New Recipe" });
});

router.get("/my-recipes", requireAuth, async (req,res) => {
    res.render("recipes/index", { title: "My Recipes", recipes: await getUserRecipes(req.user.id), user: req.user, authenticated: req.authenticated });
});

router.get("/favorites", requireAuth, async (req,res) => {
    
    res.render("recipes/index", { title: "My Favorites", recipes: await getFavorites(req.user.id), user: req.user, authenticated: req.authenticated });
});

router.get("/:id", async (req, res) => {
    const recipe = await getRecipeById(req.params.id);
    if (!recipe) {
        res.status(404).send("Recipe not found");
        return;
    }
    const ratingAverage = await getRatingAverage(req.params.id);
    const numFavorites = await getNumFavorites(req.params.id);
    res.render("recipes/show", { title: recipe.title, recipe: recipe, 
        isOwner: isOwner(recipe, req.user), authenticated: req.authenticated, ratingAverage, numFavorites });
});



router.post("/", requireAuth, async (req, res) => {
    await createRecipe(req);
    res.redirect("/recipes");
});

router.get("/:id/edit", requireAuth, async (req,res) => {
    res.render("recipes/edit", {title: "edit recipe", recipe: await getRecipeById(req.params.id), user: req.user, authenticated: req.authenticated});
})

router.post("/:id", requireAuth, async (req,res) => {
    const id = req.params.id;
    await updateRecipe(id, req);
    res.redirect(`/recipes/${id}`);
})

router.post("/:id/delete", requireAuth, async (req,res) => {
    console.log("alo")
    await deleteRecipe(req.params.id);
    res.redirect("/recipes");
});

router.post("/:id/rate", requireAuth, async (req,res) => {
    const { rating } = req.body;
    await rateRecipe(req.params.id, req.user.id, rating);
    res.redirect(`/recipes/${req.params.id}`);
});

router.post("/:id/favorite", requireAuth, async (req,res) => {
    await favoriteRecipe(req.params.id, req.user.id);
    res.redirect(`/recipes/${req.params.id}`);
})



export default router;