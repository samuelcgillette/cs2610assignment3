import { Router } from "express";
import { createUser, getUserById, getUserByEmail, getUserByUsername } from "../modules/users.js";
import { createSession } from "../modules/sessions.js";
import { getUserRecipes } from "../modules/recipes.js";

const router = Router();

function validateUserBody(body) {
  if (body.firstname === '' || body.lastname === '' || body.email === '' || body.password === '') return false;
  if (!body.email.includes('@')) return false;
  if (body.password_hash.length < 8) return false;
  return true;
}

router.get("/new", (req, res) => {
    res.render("users/new");
});



// Create a new user
router.post("/new", async (req, res) => {
    const { username, email, password_hash } = req.body;
    if (!validateUserBody(req.body)) {
        res.status(400).render("users/new", {
            error: "Make sure you have filled out all fields and that your password is long enough (8 characters)",
        });
        return;
    }

    if (await getUserByEmail(email) || await getUserByUsername(username)) {
        res.status(400).render("users/new", {
            error: "User with that email or username already exists. Please choose a different email or username.",
        });
        return;
    }

    const user = await createUser(username, email, password_hash);

    const token = await createSession(user.id);
    res.cookie('session_token', token, {
    httpOnly: true,
    });
    
    res.redirect("/");
});

router.get("/:id", async (req, res) => {
    const user = await getUserById(req.params.id);
    if (!user) {
        res.status(404).send("User not found");
        return;
    }

    const { recipes, numRecipes } = await getUserRecipes(req.params.id);
    const accountCreatedAt = new Date(user.created_at).toLocaleDateString();

    res.render("users/show", {
        title: `${user.username}'s Recipes`,
        user,
        recipes,
        numRecipes,
        accountCreatedAt,
        authenticated: req.authenticated
    });

});
export default router;