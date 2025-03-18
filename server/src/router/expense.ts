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

    /**
     * GET /expense/:budgetRowId: Retrieves the expenses for a specific budget row.
    * 
    * @param req - The request object: the session information and budgetRowId parameter.
    * @param res - The response object: the expenses or an error message.
    * 
    * @returns 200 - Returns an array of expenses if the user is logged in and the budgetRowId is valid.
    * @returns 400 - Returns an error message if the budgetRowId is missing or invalid.
    * @returns 401 - Returns "Not logged in" if the user is not logged in.
    * @returns 500 - Returns an error message if there is a server error.
    * 
     */

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

    /**
     * POST /expense: Adds a new expense.
     * 
     * @param req - The request object: the session information and expense details (category, cost, description).
     * @param res - The response object: the newly created expense or an error message.
     * 
     * @returns 201 - Returns the newly created expense if the user is logged in and the expense details are valid.
     * @returns 400 - Returns an error message if the expense details are missing or invalid.
     * @returns 401 - Returns "Not logged in" if the user is not logged in.
     * @returns 500 - Returns an error message if there is a server error.
     */

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

    /**
     * DELETE /expense/:id: Deletes an expense by its ID.
     * 
     * @param req - The request object: the session information and expense ID parameter.
     * @param res - The response object: a success message or an error message.
     * 
     * @returns 200 - Returns a success message if the user is logged in and the expense ID is valid.
     * @returns 400 - Returns an error message if the expense ID is missing or invalid.
     * @returns 401 - Returns "Not logged in" if the user is not logged in.
     * @returns 500 - Returns an error message if there is a server error.
     */

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

    /**
     * PUT /expense/:id: Updates expense values by its ID.
     * 
     * @param req - The request object: the session information and expense parameters.
     * @param res - The response object: the updated expense object.
     * 
     * @returns 200 - Returns the updated expense if the user is logged in and the expense details are valid.
     * @returns 400 - Returns an error message if the expense details are missing or invalid.
     * @returns 401 - Returns "Not logged in" if the user is not logged in.
     * @returns 404 - Returns "Expense not found" if the expense ID does not exist.
     * @returns 500 - Returns an error message if there is a server error.
     */

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
            const { cost, description, budgetRowId } = req.body;
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