import { v4 as uuidv4 } from "uuid";
import { Expense } from "../model/expense.interface";
import { BudgetService } from "./budget";
import { UserService } from "./user";
import { User } from "../model/user.interface";
import { IExpenseService } from "./IExpenseService";

export class ExpenseService implements IExpenseService{
    private budgetService: BudgetService;
    private userService: UserService;

    constructor(userService: UserService, budgetService: BudgetService) {
        this.budgetService = budgetService;
        this.userService = userService;
    }

    async getExpenses(username: string): Promise<Expense[]> {
        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            throw new Error("User not found");
        }
        return [...user.expenses];
    }

    async addExpense(username: string, category: string, cost: number, description: string): Promise<Expense> {
        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            throw new Error ("User not found");
        }

        const expense = {
            id: uuidv4(),
            category: category,
            cost: cost,
            description: description
        }

        user.expenses.push(expense);

        await this.budgetService.addBudgetExpense(username, expense);

        return { ...expense };
    }

    async removeExpense(username: string, id: string): Promise<void> {
        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            throw new Error("User not found");
        }

        const index = user.expenses.findIndex(e => e.id === id);

        if (index === -1) {
            throw new Error("Expense not found");
        }

        user.expenses.splice(index, 1);

        await this.budgetService.removeBudgetExpense(username, id);

    }
}
