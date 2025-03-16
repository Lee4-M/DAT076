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
            if(typeof(id) !== "number") {
                res.status(400).send(`Bad DELETE call to ${req.originalUrl} --- id has type ${typeof(id)}`);
                return;
            }
            await expenseService.deleteExpense(id);
            res.status(200).send("Expense deleted successfully.");
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });
    

    interface EditExpenseRequest extends Request {
        body: {
            id: number,
            cost: number,
            description: string
        },
        session: any
    }

    expenseRouter.put("/expense", async (
        req: EditExpenseRequest,
        res: Response<Expense | string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const { id, cost, description } = req.body;
            if ((typeof (id) !== "number") || (typeof (cost) !== "number") || (typeof (description) !== "string")) {
                res.status(400).send(`Bad PUT call to ${req.originalUrl} --- id has type ${typeof (id)} or cost has type ${typeof (cost)} or description has type ${typeof (description)}`);
                return;
            }
            const updatedExpense: Expense | undefined = await expenseService.updateExpense(id, cost, description);
            if (!updatedExpense) {
                res.status(404).send(`Expense not found`);
                return;
            }
            res.status(200).send(updatedExpense);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    interface EditExpensesRequest extends Request {
        body: {
            ids: number[],
            costs: number[],
            descriptions: string[]
        },
        session: any
    }

    function isValidExpensesRequest(body: unknown): body is EditExpenseRequest["body"] {
        if (typeof body !== "object" || body === null || !("ids" in body) || !("costs" in body) || !("descriptions" in body)) {
            return false;
        }
    
        const { ids, descriptions, costs } = body 
    
        return (
            Array.isArray(ids) && ids.every(id => typeof id === "number") &&
            Array.isArray(costs) && costs.every(cost => typeof cost === "number") &&
            Array.isArray(descriptions) && descriptions.every(description => typeof description === "string") &&
            ids.length === descriptions.length && descriptions.length === costs.length
        );
    }

    expenseRouter.put("/expenses", async (
        req: EditExpensesRequest,
        res: Response<Expense[] | string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            
            if (!isValidExpensesRequest(req.body)) {
                res.status(400).send(`Bad PUT call to ${req.originalUrl} --- invalid request body`);
                return;
            }
            const { ids, costs, descriptions } = req.body;
            const updatedExpenses: Expense[] | undefined = await expenseService.updateAllExpenses(ids, costs, descriptions);
            if (!updatedExpenses) {
                res.status(404).send(`Expenses not found`);
                return;
            }
            res.status(201).send(updatedExpenses);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });
    return expenseRouter;
}