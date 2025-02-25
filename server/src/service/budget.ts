import { Budget } from "../model/budget.interface";
import { Expense } from "../model/expense.interface";

export class BudgetService {
    private budgets : Budget[] = [];

    async getBudgets(): Promise<Budget[]> {
        return JSON.parse(JSON.stringify(this.budgets));
    }

    async resetBudgets(): Promise<void> {
        this.budgets = [];
    }

    async addBudget(category: string, cost: number, expense?: Expense): Promise<Budget> {
        // Assuming we add expenses after adding a budget row
        const budget: Budget = {
            category: category,
            cost: cost,
            expenses: [] as Expense[],
            result: cost
        }
        if (typeof expense !== 'undefined') {
            budget.expenses.push(expense);
            budget.result -= expense.cost;
        }
        
        this.budgets.push(budget);
        return { ...budget };
    }

    async deleteBudget(category: string): Promise<boolean> {
        const index = this.budgets.findIndex(budget => budget.category === category);
        if (index === -1) { // Budget not found
            return false;
        }
        this.budgets.splice(index, 1);
        return true;
    }

    async addBudgetExpense(expense: Expense): Promise<Budget> {
        const budget = this.budgets.find(budget => budget.category === expense.category);

        if (!budget) { 
            return this.addBudget(expense.category, 0, expense);
        }

        budget.expenses.push(expense);
        budget.result -= expense.cost;

        return { ...budget };
    }
    

    async removeBudgetExpense(id: string): Promise<Budget> {
        const budget = this.budgets.find(budget => 
            budget.expenses.some(expense => expense.id === id)
        );
    
        if (!budget) {
            throw new Error("Budget not found for the expense.");
        }
    
        const index = budget.expenses.findIndex(e => e.id === id);
        if (index === -1) {
            throw new Error("Expense not found in budget.");
        }
    
        const removedExpense = budget.expenses.splice(index, 1)[0];
        budget.result += removedExpense.cost;
    
        return { ...budget };
    }
}

