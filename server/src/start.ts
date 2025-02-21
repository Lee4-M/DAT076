import express from "express";
import cors from "cors";
import { expenseRouter } from "./router/expense";
import { budgetRouter } from "./router/budget";

export const app = express();

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use("/expense", expenseRouter);
app.use("/budget", budgetRouter);   