import express from "express";
import { AuthService } from "../service/auth";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = await AuthService.register(username, password);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        if (!req.session) throw new Error("Session not initialized");
        const { username, password } = req.body;
        const user = await AuthService.login(username, password, req.session);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ error: error instanceof Error ? error.message : "Unknown login error" });
    }
});


authRouter.post("/logout", (req, res) => {
    AuthService.logout(req.session);
    res.status(200).json({ message: "Logged out" });
});

authRouter.get("/session", (req, res) => {
    const user = AuthService.getSessionUser(req.session);
    res.status(200).json({ user });
});
