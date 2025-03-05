import express, { Request, Response, Router } from "express";
import { BudgetService } from "../service/budget";
import { Budget } from "../model/budget.interface";

export function budgetRouter(budgetService: BudgetService): Router {
    const budgetRouter = express.Router();

    interface BudgetRequest {
        session: any
    }
    budgetRouter.get("/budget", async (
        req: BudgetRequest,
        res: Response<Budget[] | string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const budgets: Budget[] | undefined = await budgetService.getBudgets(req.session.username);
            if (!budgets) {
                console.log("User logged in as " + req.session.username + " no longer exists");
                delete req.session.username;
                res.status(401).send("Not logged in");
                return;
            }
            res.status(200).send(budgets);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    interface AddBudgetRequest extends Request {
        body: {
            category: string,
            cost: number
        },
        session: any
    }

    budgetRouter.post("/budget", async (
        req: AddBudgetRequest,
        res: Response<Budget | string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const category = req.body.category;
            const cost = req.body.cost;
            if ((typeof (category) !== "string") || (typeof (cost) !== "number")) {
                res.status(400).send(`Bad PUT call to ${req.originalUrl} --- description has type ${typeof (category)}`);
                return;
            }
            const newBudget: Budget | undefined = await budgetService.addBudget(req.session.username, category, cost);
            res.status(201).send(newBudget);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    interface DeleteBudgetRequest extends Request {
        body: {
            category: string
        },
        session: any
    }

    budgetRouter.delete("/budget", async (
        req: DeleteBudgetRequest,
        res: Response<string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const category = req.body.category;
            if (typeof (category) !== "string") {
                res.status(400).send("category should be a string");
                return;
            }
            const success = await budgetService.deleteBudget(req.session.username, category);
            if (success) {
                res.status(200).send("Budget deleted");
            } else {
                res.status(404).send("Budget not found");
            }
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });
  
    interface DeleteBudgetExpenseRequest extends Request {
        body: {
            id: string
        },
        session: any
    }

    budgetRouter.delete("/", async (
        req: DeleteBudgetExpenseRequest,
        res: Response<Budget | string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const id = req.body.id;
            const updatedBudget = await budgetService.removeBudgetExpense(req.session.username, id);
            res.status(200).send(updatedBudget);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    interface EditBudgetRequest extends Request {
        body: {
            category: string,
            cost: number
        },
        session: any
    }

    budgetRouter.put("/budget", async (
        req: EditBudgetRequest,
        res: Response<Budget | string>
    ) => {
        try {
            if (!req.session.username) {
                res.status(401).send("Not logged in");
                return;
            }
            const category = req.body.category;
            const cost = req.body.cost;
            if ((typeof (category) !== "string") || (typeof (cost) !== "number")) {
                res.status(400).send(`Bad PUT call to ${req.originalUrl} --- description has type ${typeof (category)}`);
                return;
            }
            const newBudget: Budget | undefined = await budgetService.updateBudget(req.session.username, category, cost);
            res.status(201).send(newBudget);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    // interface EditBudgetsRequest extends Request {
    //     body: {
    //         categories: [string],
    //         amounts: [number]
    //     },
    //     session: any
    // }

    // budgetRouter.put("/budgets", async (
    //     req: EditBudgetsRequest,
    //     res: Response<Budget[] | string>
    // ) => {
    //     try {
    //         if (!req.session.username) {
    //             res.status(401).send("Not logged in");
    //             return;
    //         }
    //         const categories = req.body.categories;
    //         const amounts = req.body.amounts;
            
    //         // if ((typeof (category) !== "string") || (typeof (cost) !== "number")) {
    //         //     res.status(400).send(`Bad PUT call to ${req.originalUrl} --- description has type ${typeof (category)}`);
    //         //     return;
    //         // }

    //         const newBudgets: Budget[] | undefined = await budgetService.updateBudgets(req.session.username, categories, amounts);
    //         res.status(201).send(newBudgets);
    //     } catch (e: any) {
    //         res.status(500).send(e.message);
    //     }
    // });
    
    return budgetRouter;  
}


