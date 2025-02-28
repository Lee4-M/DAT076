import express, { Request, Response, Router } from "express";
import { Expense } from "../model/expense.interface";
import { ExpenseService } from "../service/expense";

export function expenseRouter(expenseService: ExpenseService): Router {
    const expenseRouter = express.Router();

    interface ExpenseRequest {
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
            const expenses: Expense[] | undefined = await expenseService.getExpenses(req.session.username);
            if (!expenses) {
                console.log("User logged in as " + req.session.username + " no longer exists");
                delete req.session.username;
                res.status(401).send("Not logged in");
                return;
            }
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
                res.status(400).send(`Bad PUT call to ${req.originalUrl} --- description has type ${typeof (category)}`);
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
            const id = req.body.id
            console.log(`Deleting expense with ID: ${id}`);
            await expenseService.removeExpense(req.session.username, id);
            res.status(200).send("Expense deleted successfully.");
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });
    return expenseRouter;
}