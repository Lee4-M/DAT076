import { v4 as uuidv4 } from "uuid";
import { Expense } from "../model/expense.interface";
import { User } from "../model/user.interface";
import { IExpenseService } from "./IExpenseService";
import { IBudgetService } from "./IBudgetService";
import { IUserService } from "./IUserService";

export class ExpenseDBService implements IExpenseService{
    private budgetService: IBudgetService;
    private userService: IUserService;

    constructor(userService: IUserService, budgetService: IBudgetService) {
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

    }
}
