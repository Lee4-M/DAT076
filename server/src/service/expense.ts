import { Expense } from "../model/expense.interface";

export class ExpenseService {
    private expenses : Expense[] = [];

    async getExpenses(): Promise<Expense[]> {
        return JSON.parse(JSON.stringify(this.expenses));
    }

    // Creates a new task with the given description and adds it to the list
    // Returns a copy of the newly created task
    async addExpense(category: string, cost: number, description: string): Promise<Expense> {
        const expense = {
            category: category,
            cost: cost,
            description: description
        }
        this.expenses.push(expense);
        return { ...expense };
    }
}