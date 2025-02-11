import { Budget } from "../model/budget.interface";

export class BudgetService {
    private budgets : Budget[] = [];

    async getBudgets(): Promise<Budget[]> {
        return JSON.parse(JSON.stringify(this.budgets));
    }

    async addBudget(category: string, cost: number): Promise<Budget> {
        const budget = {
            category: category,
            cost: cost
        }
        this.budgets.push(budget);
        return { ...budget };
    }
}