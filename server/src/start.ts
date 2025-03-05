import express from "express";
import session from "express-session";

import cors from "cors";
import dotenv from "dotenv";

import { expenseRouter } from "./router/expense";
import { budgetRowRouter } from "./router/budget";
import { userRouter } from "./router/user";
import { BudgetRowService } from "./service/budget";
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
const budgetRowService = new BudgetRowService(userService);
const expenseService = new ExpenseService(budgetRowService);

app.use(budgetRowRouter(budgetRowService));
app.use(expenseRouter(expenseService));
app.use(userRouter(userService));