import { Router } from "express";
import { requireAuth } from "../middleware/require_auth.js";
import { getAllRecipes, getRecipeById, 
    createRecipe, updateRecipe, favoriteRecipe, unfavoriteRecipe,
    deleteRecipe, rateRecipe, getUserRecipes, 
    getFavorites, getRatingAverage, getNumFavorites, isOwner, 
    getRecipeByWord, getUserRatingForRecipe, isUserFavorite} from "../modules/recipes.js";

const router = Router();

router.get("/", async (req, res) => {
    let recipes;
    if (req.query.search) {
        recipes = await getRecipeByWord(req.query.search)
    }
    else {
        recipes = await getAllRecipes();
    }
    res.render("recipes/index", { title: "All Recipes", recipes: recipes, user: req.user, authenticated: req.authenticated });
});

router.get("/new", requireAuth, (req, res) => {
    res.render("recipes/new", { title: "New Recipe" });
});

router.get("/my-recipes", requireAuth, async (req,res) => {
    const result = await getUserRecipes(req.user.id);
    res.render("recipes/special", { title: "My Recipes", recipes: result.recipes, user: req.user, authenticated: req.authenticated });
});

router.get("/favorites", requireAuth, async (req,res) => {
    
    res.render("recipes/special", { title: "My Favorites", recipes: await getFavorites(req.user.id), user: req.user, authenticated: req.authenticated });
});

router.get("/:id", async (req, res) => {
    const recipe = await getRecipeById(req.params.id);
    if (!recipe) {
        res.status(404).send("Recipe not found");
        return;
    }
    const createdAtDisplay = new Date(recipe.created_at).toLocaleString();
    const updatedAtDisplay = new Date(recipe.updated_at).toLocaleString();
    const ratingSummary = await getRatingAverage(req.params.id);

    let userRating = 0;
    let isFavorite = false;
    if (req.authenticated) {
        userRating = await getUserRatingForRecipe(req.params.id, req.user.id);
        isFavorite = await isUserFavorite(req.params.id, req.user.id);
    }

    const numFavorites = await getNumFavorites(req.params.id);
    res.render("recipes/show", { title: recipe.title, recipe: recipe, 
        isOwner: isOwner(recipe, req.user), authenticated: req.authenticated, ratingSummary, 
        numFavorites, createdAtDisplay, updatedAtDisplay, userRating, isFavorite });
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

router.post("/:id/unfavorite", requireAuth, async (req,res) => {
    await unfavoriteRecipe(req.params.id, req.user.id);
    res.redirect(`/recipes/${req.params.id}`);
})



export default router;