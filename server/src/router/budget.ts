import express, { Request, Response, Router } from "express";
import { BudgetRow } from "../model/budgetRow.interface";
import { IBudgetRowService } from "../service/interface/IBudgetRowService";

export function budgetRowRouter(budgetRowService: IBudgetRowService): Router {
    const budgetRowRouter = express.Router();

    interface BudgetRowRequest extends Request {
        session: any
    }

    /**
     * GET /budget: Retrieves the budget rows for the logged-in user.
     * 
     * @param req - The request object, which includes the session information.
     * @param res - The response object, which will contain the budget rows or an error message.
     * 
     * @returns 200 - Returns an array of budget rows if the user is logged in and budget rows are found.
     * @returns 401 - Returns "Not logged in" if the user is not logged in or the user no longer exists.
     * @returns 500 - Returns an error message if there is a server error.
     * 
     */

    budgetRowRouter.get("/budget", async (
        req: BudgetRowRequest,
        res: Response<BudgetRow[] | string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const budgetRows: BudgetRow[] | undefined = await budgetRowService.getBudgetRows(req.session.username);
            if (!budgetRows) {
                console.log("User logged in as " + req.session.username + " no longer exists");
                delete req.session.username;
                res.status(401).send("Not logged in");
                return;
            }
            res.status(200).send(budgetRows);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    interface AddBudgetRowRequest extends Request {
        body: {
            category: string,
            amount: number
        },
        session: any
    }

    /**
     * POST /budget: Adds a new budget row for the logged-in user.
     * 
     * @param req - The request object, which includes the session information and the budget row details (category and amount).
     * @param res - The response object, which will contain the newly created budget row or an error message.
     * 
     * @returns 201 - Returns the newly created budget row if the user is logged in and the input is valid.
     * @returns 400 - Returns an error message if the input is invalid.
     * @returns 401 - Returns "Not logged in" if the user is not logged in.
     * @returns 500 - Returns an error message if there is a server error.
     */
    budgetRowRouter.post("/budget", async (
        req: AddBudgetRowRequest,
        res: Response<BudgetRow | string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const { category, amount } = req.body;
            if ((typeof (category) !== "string") || (typeof (amount) !== "number")) {
                res.status(400).send(`Bad PUT call to ${req.originalUrl} --- category has type ${typeof (category)} or amount has type ${typeof (amount)}`);
                return;
            }
            const newBudgetRow: BudgetRow | undefined = await budgetRowService.addBudgetRow(req.session.username, category, amount);
            res.status(201).send(newBudgetRow);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    interface DeleteBudgetRowRequest extends Request {
        params: {
            id: string
        },
        session: any
    }

    /**
     * DELETE /budget/:id: Deletes a budget row for the logged-in user by ID.
     * 
     * @param req - The request object, which includes the session information and the budget row ID.
     * @param res - The response object, which will contain a success message or an error message.
     * 
     * @returns 200 - Returns "Budget row deleted" if the budget row is successfully deleted.
     * @returns 400 - Returns an error message if the ID is missing or invalid.
     * @returns 401 - Returns "Not logged in" if the user is not logged in.
     * @returns 404 - Returns "Budget row not found" if the budget row does not exist.
     * @returns 500 - Returns an error message if there is a server error.
     */
    budgetRowRouter.delete("/budget/:id", async (
        req: DeleteBudgetRowRequest,
        res: Response<string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const id = Number(req.params.id);
            if (!id) {
                res.status(400).send(`Bad DELETE call to ${req.originalUrl} --- id is missing`);
                return;
            }
            const success = await budgetRowService.deleteBudgetRow(req.session.username, id);
            if (success) {
                res.status(200).send("Budget row deleted");
            } else {
                res.status(404).send("Budget row not found");
            }
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    interface EditBudgetRequest extends Request {
        params: {
            id: string
        },
        body: {
            category: string,
            amount: number,
        },
        session: any
    }

    /**
     * PUT /budget/:id: Updates a budget row for the logged-in user by ID.
     * 
     * @param req - The request object, which includes the session information, the budget row ID, and the updated budget row details (category and amount).
     * @param res - The response object, which will contain the updated budget row or an error message.
     * 
     * @returns 201 - Returns the updated budget row if the user is logged in and the input is valid.
     * @returns 400 - Returns an error message if the input is invalid.
     * @returns 401 - Returns "Not logged in" if the user is not logged in.
     * @returns 404 - Returns "Budget row not found" if the budget row does not exist.
     * @returns 500 - Returns an error message if there is a server error.
     */

    budgetRowRouter.put("/budget/:id", async (
        req: EditBudgetRequest,
        res: Response<BudgetRow | string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const id = Number(req.params.id);
            const { category, amount } = req.body;
            if ((typeof (category) !== "string") || (typeof (amount) !== "number") || !id) {
                res.status(400).send(`Bad PUT call to ${req.originalUrl} --- category has type ${typeof (category)} or amount has type ${typeof (amount)} or id is missing`);
                return;
            }
            const newBudget: BudgetRow | undefined = await budgetRowService.updateBudgetRow(req.session.username, id, category, amount);
            if (!newBudget) {
                res.status(404).send("Budget row not found");
                return;
            }
            res.status(201).send(newBudget);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    return budgetRowRouter;
}




