import { Router } from "express";
import { createUser } from "../modules/users.js";
import { createSession } from "../modules/sessions.js";

const router = Router();

function validateUserBody(body) {
  console.log("Received validate data:", body);
  if (body.firstname === '' || body.lastname === '' || body.email === '' || body.password === '') return false;
  if (!body.email.includes('@')) return false;
  if (body.password_hash.length < 8) return false;
  return true;
}

// Show form to create a new user
router.get("/new", (req, res) => {
    res.render("users/new");
});



// Create a new user
router.post("/new", async (req, res) => {
    const { username, email, password_hash } = req.body;
    console.log("Received registration data:", req.body);
    if (!validateUserBody(req.body)) {
        res.send("Make sure you have filled out all fields and that your password is long enough (8 characters)");
        return;
    }

    const user = await createUser(username, email, password_hash);

    const token = await createSession(user.id);
    res.cookie('session_token', token, {
    httpOnly: true,
    });
    
    res.redirect("/");
});



export default router;