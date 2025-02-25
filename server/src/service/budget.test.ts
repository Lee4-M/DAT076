import { app } from "../start";
import { BudgetService } from "./budget";
import { budgetService } from "../router/budget";
import request from "supertest";

test("If a budget is added it should appear in the list", async() =>{
    const category = "Clothes";
    const cost = 500;

    const budgetService = new BudgetService(); 
    await budgetService.addBudget(category, cost);

    const budgets = await budgetService.getBudgets();

    expect(budgets.some(budget => budget.category === category && budget.cost === cost)).toBeTruthy();
    
})

test("An added budget to an empty list can be deleted successfully", async() =>{
    const category = "Groceries";
    const cost = 1000;

    const budgetService = new BudgetService(); 
    await budgetService.addBudget(category, cost);
    
    await budgetService.deleteBudget(category);

    const budgets = await budgetService.getBudgets();

    expect(budgets.length === 0).toBeTruthy();
})

test("Budget deletec successfully", async() =>{
    const category = "Groceries";
    const cost = 1000;

    // TODO: Change names so they budget service instance from router is different
    // from newly created branches.
    await budgetService.resetBudgets();
    await budgetService.addBudget(category, cost);
    
    const response = await request(app)
        .delete("/budget")
        .send({ category : "Groceries" })
        .expect(200);
})

test("Wrong budget item attempted to be deleted", async() =>{
    const category = "Groceries";
    const cost = 1000;

    // TODO: Change names so they budget service instance from router is different
    // from newly created branches.
    await budgetService.resetBudgets();
    await budgetService.addBudget(category, cost);
    
    const response = await request(app)
        .delete("/budget")
        .send({ category : "not-existing" })
        .expect(404);
})