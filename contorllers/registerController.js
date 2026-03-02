import { Router } from "express";
import { getClient } from "../utils/db";
import bcrypt from "bcrypt";

const router = Router();

// Show form to create a new user
router.get("/", (req, res) => {
    res.render("newUser");
});

// Create a new user
const saltRounds = 10;
router.post("/", async (req, res) => {
    const { username, email, password_hash } = req.body;

    const hash = await bcrypt.hash(password_hash, saltRounds);
    const client = getClient();
    await client.connect();
    try {
        const result = await client.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)",
            [username, email, hash]
        );
    } catch (err) {
        console.error("Error creating user:", err);
    } finally {
        await client.end();
    }
    res.redirect("/");
});

export default router;