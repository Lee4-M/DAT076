import express, { Request, Response } from "express";
import { BudgetService } from "../service/budget";
import { Budget } from "../model/budget.interface";

export const budgetService = new BudgetService();

export const budgetRouter = express.Router();

budgetRouter.get("/", async (
    req: Request<{}, {}, {}>,
    res: Response<Array<Budget> | string>
) => {
    try {
        const budgets = await budgetService.getBudgets();
        res.status(200).send(budgets);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

budgetRouter.post("/", async (
    req: Request<{}, {}, { category : string, cost : number}>,
    res: Response<Budget | string>
) => {
    try {
        const category = req.body.category;
        const cost = req.body.cost;
        if ((typeof(category) !== "string") || (typeof(cost) !== "number")){
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- description has type ${typeof(category)}`);
            return;
        }
        const newBudget = await budgetService.addBudget(category, cost);
        res.status(201).send(newBudget);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
})

budgetRouter.delete("/", async (
    req: Request<{}, {}, { category: string }>,
    res: Response<string>
) => {
    try {
        const { category } = req.body;
        const success = await budgetService.deleteBudget(category);
        if (success) {
            res.status(200).send("Budget deleted");
        } else {
            res.status(404).send("Budget not found");
        }
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

budgetRouter.delete("/expense", async (
    req: Request<{}, {}, { id: string }>,
    res: Response<Budget | string>
) => {
    try {
        const { id } = req.body;
        const updatedBudget = await budgetService.removeBudgetExpense(id);
        res.status(200).send(updatedBudget);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});