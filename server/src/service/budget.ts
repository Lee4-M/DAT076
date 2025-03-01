import { Budget } from "../model/budget.interface";
import { Expense } from "../model/expense.interface";
import { User } from "../model/user.interface";
import { UserService } from "./user";

export class BudgetService {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async getBudgets(username: string): Promise<Budget[] | undefined> {
        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            return undefined;
        }
        return JSON.parse(JSON.stringify(user.budgets));
    }

    async resetBudgets(username: string): Promise<void | undefined> {
        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            return undefined;
        }
        user.budgets = [];
    }

    async addBudget(username: string, category: string, cost: number, expense?: Expense): Promise<Budget | undefined> {
        // Assuming we add expenses after adding a budget row
        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            return undefined;
        }

        const budget: Budget = {
            category: category,
            cost: cost,
            expenses: [] as Expense[],
            result: cost
        }

        // TODO: Calculate result in function outside of field.
        if (typeof expense !== 'undefined') {
            budget.expenses.push(expense);
            budget.result -= expense.cost;
        }

        user.budgets.push(budget);
        return { ...budget };
    }

    async deleteBudget(username: string, category: string): Promise<boolean | undefined> {
        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            return undefined;
        }

        const index = user.budgets.findIndex(budget => budget.category === category);
        if (index === -1) { // Budget not found
            return false;
        }

        user.budgets.splice(index, 1);
        return true;
    }

    async addBudgetExpense(username: string, expense: Expense): Promise<Budget | undefined> {
        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            return undefined;
        }

        const budget = user.budgets.find(budget => budget.category === expense.category);

        if (!budget) {
            return this.addBudget(username, expense.category, 0, expense);
        }

        budget.expenses.push(expense);
        budget.result -= expense.cost;

        return { ...budget };
    }


    async removeBudgetExpense(username: string, id: string): Promise<Budget | undefined> {
        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            return undefined;
        }

        const budget = user.budgets.find(budget =>
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

