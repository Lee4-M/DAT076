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
            const category = req.body.category;
            const amount = req.body.amount;
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
            
            const category = req.body.category;
            const amount = req.body.amount;
            const budgetId = req.body.id;
            if ((typeof (category) !== "string") || (typeof (amount) !== "number")) {
                res.status(400).send(`Bad PUT call to ${req.originalUrl} --- description has type ${typeof (category)}`);
                return;
            }
            const newBudget: BudgetRow | undefined = await budgetRowService.updateBudgetRow(req.session.username, budgetId, category, amount);
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

    budgetRowRouter.put("/budgets", async (
        req: EditBudgetsRequest,
        res: Response<BudgetRow[] | string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const categories = req.body.categories;
            const amounts = req.body.amounts;
            const ids = req.body.ids;
            const newBudgets: BudgetRow[] | undefined = await budgetRowService.updateAllBudgetRows(req.session.username, ids, categories, amounts);
            res.status(201).send(newBudgets);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });
    
    
    return budgetRowRouter;
}


