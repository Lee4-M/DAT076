import express from "express";
import session from "express-session";

import cors from "cors";
import dotenv from "dotenv";

import { expenseRouter } from "./router/expense";
import { budgetRouter } from "./router/budget";
import { userRouter } from "./router/user";
import { BudgetService } from "./service/budget";
import { UserService } from "./service/user";
import { ExpenseService } from "./service/expense";

export const app = express();

dotenv.config();
if (!process.env.SESSION_SECRET) {
  console.log("Could not find SESSION_SECRET in .env file");
  process.exit();
}
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
const userService = new UserService();
const budgetService = new BudgetService(userService);
const expenseService = new ExpenseService(userService, budgetService);

app.use(budgetRouter(budgetService));
app.use(expenseRouter(expenseService));
app.use(userRouter(userService));