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
        params: {
            id: string
        },
        session: any
    }

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




