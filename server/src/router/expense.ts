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

    expenseRouter.get("/expense/:budgetRowId", async (
        req: ExpenseRequest,
        res: Response<Expense[] | string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const budgetRowId = Number(req.params.budgetRowId);
            if (!budgetRowId) {
                res.status(400).send(`Bad GET call to ${req.originalUrl} --- budgetRowId is missing`);
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
            const { category, cost, description } = req.body;
            if ((typeof (category) !== "string") || (typeof (cost) !== "number") || (typeof (description) !== "string")) {
                res.status(400).send(`Bad PUT call to ${req.originalUrl} --- category has type ${typeof (category)} or cost has type ${typeof (cost)} or description has type ${typeof (description)}`);
                return;
            }
            const newExpense: Expense | undefined = await expenseService.addExpense(req.session.username, category, cost, description);
            res.status(201).send(newExpense);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    interface DeleteExpenseRequest extends Request {
        params: {
            id: string
        },
        session: any
    }

    expenseRouter.delete("/expense/:id", async (
        req: DeleteExpenseRequest,
        res: Response<string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const id = Number(req.params.id)
            if (!id) {
                res.status(400).send(`Bad DELETE call to ${req.originalUrl} --- id is missing`);
                return;
            }
            await expenseService.deleteExpense(id);
            res.status(200).send("Expense deleted successfully.");
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    interface EditExpenseRequest extends Request {
        params: {
            id: string
        },
        body: {
            cost: number,
            description: string
            budgetRowId?: number
        },
        session: any
    }

    expenseRouter.put("/expense/:id", async (
        req: EditExpenseRequest,
        res: Response<Expense | string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const id = Number(req.params.id)
            const { cost, description, budgetRowId} = req.body;
            if ((typeof (cost) !== "number") || (typeof (description) !== "string" || !id)) {
                res.status(400).send(`Bad PUT call to ${req.originalUrl} --- cost has type ${typeof (cost)} or description has type ${typeof (description)} or id is missing`);
                return;
            }
            const updatedExpense: Expense | undefined = await expenseService.updateExpense(id, cost, description, budgetRowId);
            if (!updatedExpense) {
                res.status(404).send(`Expense not found`);
                return;
            }
            res.status(200).send(updatedExpense);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    return expenseRouter;
}