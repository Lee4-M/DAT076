import express from "express";
import { expenseRouter } from "./router/expense";

export const app = express();

app.use(express.json());
app.use("/expense", expenseRouter);