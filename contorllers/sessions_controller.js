import { Router } from "express";
import { authenticateUser } from "../modules/users";

const router = Router();

router.post("/", async (req, res) => {
    const user = await authenticateUser(req.body.email, req.body.password);

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

router.post("/logout", async (req, res) => {
    res.clearCookie("session_token");
    deleteSession(req.cookies.session_token);
    res.redirect("/");
});

router.get("/new", async (req, res) => {
    res.render("sessions/new", { title: "Login" });
});

export default router;