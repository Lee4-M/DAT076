import { BudgetService } from "./budget";

test("If a budget is added it should appear in the list", async() =>{
    const category = "Clothes";
    const cost = 500;

    const budgetService = new BudgetService(); 
    await budgetService.addBudget(category, cost);

    const budgets = await budgetService.getBudgets();

    expect(budgets.some(budget => budget.category === category && budget.cost === cost)).toBeTruthy();
    
})

