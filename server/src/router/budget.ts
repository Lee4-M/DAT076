import express, { Request, Response, Router } from "express";
import { BudgetRow } from "../model/budgetRow.interface";
import { IBudgetRowService } from "../service/interface/IBudgetRowService";

export function budgetRowRouter(budgetRowService: IBudgetRowService): Router {
    const budgetRowRouter = express.Router();

    interface BudgetRowRequest extends Request {
        session: any
    }

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
        body: {
            id: number
        },
        session: any
    }

    budgetRowRouter.delete("/budget", async (
        req: DeleteBudgetRowRequest,
        res: Response<string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const id = req.body.id;
            if (typeof (id) !== "number") {
                res.status(400).send(`Bad DELETE call to ${req.originalUrl} --- id has type ${typeof (id)}`);
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
        body: {
            category: string,
            amount: number,
            id: number
        },
        session: any
    }

    budgetRowRouter.put("/budget", async (
        req: EditBudgetRequest,
        res: Response<BudgetRow | string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const { category, amount, id } = req.body;
            if ((typeof (category) !== "string") || (typeof (amount) !== "number") || (typeof (id) !== "number")) {
                res.status(400).send(`Bad PUT call to ${req.originalUrl} --- category has type ${typeof (category)}, budget has type ${typeof (id)} or amount has type ${typeof (amount)}`);
                return;
            }
            const newBudget: BudgetRow | undefined = await budgetRowService.updateBudgetRow(req.session.username, id, category, amount);
            if(!newBudget) {
                res.status(404).send("Budget row not found");
                return;
            }
            res.status(201).send(newBudget);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    interface EditBudgetsRequest extends Request {
        body: {
            ids: [number],
            categories: [string],
            amounts: [number]
        },
        session: any
    }

    function isValidBudgetRequest(body: unknown): body is EditBudgetsRequest["body"] {
        if (typeof body !== "object" || body === null || !("ids" in body) || !("categories" in body) || !("amounts" in body)) {
            return false;
        }
    
        const { ids, categories, amounts } = body 
    
        return (
            Array.isArray(ids) && ids.every(id => typeof id === "number") &&
            Array.isArray(categories) && categories.every(category => typeof category === "string") &&
            Array.isArray(amounts) && amounts.every(amount => typeof amount === "number") &&
            ids.length === categories.length && categories.length === amounts.length
        );
    }

    budgetRowRouter.put("/budgets", async (
        req: EditBudgetsRequest,
        res: Response<BudgetRow[] | string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            if (!isValidBudgetRequest(req.body)) {
                res.status(400).send(`Bad PUT call to ${req.originalUrl} --- invalid request body`);
                return;
            }
            const { ids, categories, amounts } = req.body;

            const newBudgets: BudgetRow[] | undefined = await budgetRowService.updateAllBudgetRows(req.session.username, ids, categories, amounts);
            if(!newBudgets) {
                res.status(404).send("Budget rows not found");
                return;
            }
            res.status(201).send(newBudgets);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });
    
    
    return budgetRowRouter;
}




