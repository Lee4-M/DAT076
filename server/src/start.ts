import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import { expenseRouter } from "./router/expense";
import { budgetRouter } from "./router/budget";
import { authRouter } from "./router/userAuthentication"
import { AuthService } from "./service/auth";

dotenv.config();

export const app = express();

app.use(express.json());

app.use(express.json());



dotenv.config();
app.use(session({
  secret: process.env.SESSION_SECRET || "fallback_secret_key",
  resave : false,
  saveUninitialized : true
}));
app.use(cors({
  origin: true,
  credentials: true
}));


const authService = new AuthService();
app.use("/auth", authRouter(authService));

app.use("/expense", expenseRouter);
app.use("/budget", budgetRouter);