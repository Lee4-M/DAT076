import express, { Request, Response, Router } from "express";
import { Expense } from "../model/expense.interface";
import { IExpenseService } from "../service/interface/IExpenseService";

export function expenseRouter(expenseService: IExpenseService): Router {
    const expenseRouter = express.Router();

    interface ExpenseRequest extends Request {
        params: {
            budgetRowId: string
        }
        session: any
    }

    expenseRouter.get("/expense", async (
        req: ExpenseRequest,
        res: Response<Expense[] | string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const budgetRowId = Number(req.query.budgetRowId);
            if (isNaN(budgetRowId)) {
                res.status(400).send(`Bad GET call to ${req.originalUrl} --- budgetRowId is missing or not a number`);
                return;
            }
            const expenses: Expense[] | undefined = await expenseService.getExpenses(budgetRowId);
            res.status(200).send(expenses);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    interface AddExpenseRequest extends Request {
        body: {
            category: string,
            cost: number,
            description: string
        },
        session: any
    }

    expenseRouter.post("/expense", async (
        req: AddExpenseRequest,
        res: Response<Expense | string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const category = req.body.category;
            const cost = req.body.cost;
            const description = req.body.description;
            if ((typeof (category) !== "string") || (typeof (cost) !== "number") || (typeof (description) !== "string")) {
                res.status(400).send(`Bad PUT call to ${req.originalUrl} --- category has type ${typeof (category)} or cost has type ${typeof (cost)} or description has type ${typeof (description)}`);
                return;
            }
            const newExpense: Expense | undefined = await expenseService.addExpense(req.session.username, category, cost, description);
            res.status(201).send(newExpense);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    })

    interface DeleteExpenseRequest extends Request {
        body: {
            id: number
        },
        session: any
    }

    expenseRouter.delete("/expense", async (
        req: DeleteExpenseRequest,
        res: Response<string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const id = req.body.id
            await expenseService.deleteExpense(id);
            res.status(200).send("Expense deleted successfully.");
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });
    return expenseRouter;
}