import { Budget } from "../model/budget.interface";
import { Expense } from "../model/expense.interface";

export class BudgetService {
    private budgets : Budget[] = [];

    async getBudgets(): Promise<Budget[]> {
        return JSON.parse(JSON.stringify(this.budgets));
    }

    async addBudget(category: string, cost: number): Promise<Budget> {
        const budget = {
            category: category,
            cost: cost,
            expense: [],
            result: cost
        }
        this.budgets.push(budget);
        return { ...budget };
    }

    async addBudgetExpense(expense: Expense): Promise<Budget | null> {
        const budget = this.budgets.find(budget => budget.category === expense.category);
        if (budget) {
            budget.expense.push(expense);
            budget.result -= expense.cost;
            return { ...budget };
        }
        return null
    }
}

