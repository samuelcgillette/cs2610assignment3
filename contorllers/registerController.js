import { Router } from "express";
import { createUser } from "../models/users.js";

import pool from "../utils/db.js";

const router = Router();

function validateUserBody(body) {
  if (body.firstname === '' || body.lastname === '' || body.email === '' || body.password === '') return false;
  if (!body.email.includes('@')) return false;
  if (body.password.length < 8) return false;
  return true;
}

// Show form to create a new user
router.get("/", (req, res) => {
    res.render("users/new");
});



// Create a new user
router.post("/", async (req, res) => {
    const { username, email, password_hash } = req.body;

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