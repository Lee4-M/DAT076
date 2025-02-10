import express, { Request, Response } from "express";
import { ExpenseService } from "../service/expense";
import { Expense } from "../model/expense.interface";

const expenseService = new ExpenseService();

export const expenseRouter = express.Router();

expenseRouter.get("/", async (
    req: Request<{}, {}, {}>,
    res: Response<Array<Expense> | String>
) => {
    try {
        const expenses = await expenseService.getExpenses();
        res.status(200).send(expenses);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

expenseRouter.post("/", async (
    req: Request<{}, {}, { category : string, cost : number, description : string }>,
    res: Response<Expense | string>
) => {
    try {
        const description = req.body.description;
        if (typeof(category) !== "string") {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- description has type ${typeof(description)}`);
            return;
        }
        const newExpense = await expenseService.addExpense(category, cost, description);
        res.status(201).send(newExpense);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
})
