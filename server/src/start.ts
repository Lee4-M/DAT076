import express from "express";
import { expenseRouter } from "./router/expense";
import { budgetRouter } from "./router/budget";

export const app = express();

app.use(express.json());
app.use("/expense", expenseRouter);
app.use("/budget", budgetRouter);