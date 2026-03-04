import { Router } from "express";
import { authenticateUser } from "../modules/users.js";
import { requireAuth } from "../middleware/require_auth.js";
import { createSession, deleteSession } from "../modules/sessions.js";


const router = Router();

router.post("/", async (req, res) => {
    const user = await authenticateUser(req.body.email, req.body.password_hash);

    if (!user) {
        res.send("Invalid email or password");
        return;
    }

    const token = await createSession(user.id);
    res.cookie('session_token', token, {
        httpOnly: true,
    });
    res.redirect("/");
});

router.post("/logout", requireAuth, async (req, res) => {
    res.clearCookie("session_token");
    await deleteSession(req.cookies.session_token, req.user.id);
    res.redirect("/");
});

router.get("/new", async (req, res) => {
    res.render("sessions/new", { title: "Login" });
});

router.get("/login", async (req, res) => {
    res.render("sessions/login", { title: "Login" });
});

export default router;