import { v4 as uuidv4 } from "uuid";
import { Expense } from "../model/expense.interface";
import { BudgetService } from "./budget";
import { UserService } from "./user";
import { User } from "../model/user.interface";

export class ExpenseService {
    private budgetService: BudgetService;
    private userService: UserService;

    constructor(userService: UserService, budgetService: BudgetService) {
        this.budgetService = budgetService;
        this.userService = userService;
    }

    async getExpenses(username: string): Promise<Expense[] | undefined> {
        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            return undefined;
        }
        return [...user.expenses];
    }

    async addExpense(username: string, category: string, cost: number, description: string): Promise<Expense | undefined> {
        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            return undefined;
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
            return;
        }

        const index = user.expenses.findIndex(e => e.id === id);

        if (index === -1) {
            throw new Error("Expense not found");
        }

        user.expenses.splice(index, 1);

        await this.budgetService.removeBudgetExpense(username, id);
    }
}
