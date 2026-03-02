import { Router } from "express";
import pool from "../utils/db.js";
import bcrypt from "bcrypt";

const router = Router();

// Show form to create a new user
router.get("/", (req, res) => {
    res.render("users/new");
});

// Create a new user
const saltRounds = 10;
router.post("/", async (req, res) => {
    const { username, email, password_hash } = req.body;

    const hash = await bcrypt.hash(password_hash, saltRounds);
    try {
        const result = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)",
            [username, email, hash]
        );
    } catch (err) {
        console.error("Error creating user:", err);
    }
    res.redirect("/");
});

export default router;