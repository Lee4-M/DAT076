import { v4 as uuidv4 } from "uuid";
import { Expense } from "../model/expense.interface";
import { BudgetService } from "./budget";

export class ExpenseService {
    private expenses: Expense[] = [];
    private budgetService: BudgetService;

    constructor(budgetService: BudgetService) {
        this.budgetService = budgetService;
    }

    async getExpenses(): Promise<Expense[]> {
        return [...this.expenses];
    }

    async addExpense(category: string, cost: number, description: string): Promise<Expense> {
        const expense = {
            id: uuidv4(),
            category: category,
            cost: cost,
            description: description
        }

        this.expenses.push(expense);

        await this.budgetService.addBudgetExpense(expense);

        return { ...expense };
    }

    async removeExpense(id: string): Promise<void> {
        const index = this.expenses.findIndex(e => e.id === id);
        
        if (index === -1) {
            throw new Error("Expense not found");
        }

        this.expenses.splice(index, 1);

        await this.budgetService.removeBudgetExpense(id);
    }
}
