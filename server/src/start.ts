import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import { expenseRouter } from "./router/expense";
import { budgetRouter } from "./router/budget";
import { authRouter } from "./router/userAuthentication"

dotenv.config();

export const app = express();

app.use(express.json());

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));


app.use(
    session({
        secret: process.env.SESSION_SECRET || "fallback_secret_key", 
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            maxAge: 1000 * 60 * 60 // 1 hour session timeout
        }
}));

app.use("/auth", authRouter);
app.use("/expense", expenseRouter);
app.use("/budget", budgetRouter);