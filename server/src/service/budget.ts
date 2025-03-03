import { BudgetModel } from "../db/budget.db";
import { Budget } from "../model/budget.interface";
import { Expense } from "../model/expense.interface";
import { User } from "../model/user.interface";
import { IBudgetService } from "./IBudgetService";
import { UserService } from "./user";

export class BudgetService implements IBudgetService {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async getBudgets(username: string): Promise<Budget[] | undefined> {
        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            return undefined
        }
        return BudgetModel.findAll({ where: { userId: user.id } });
    }

    async addBudget(username: string, category: string, amount: number, expense?: Expense): Promise<Budget | undefined> {
        // Assuming we add expenses after adding a budget row
        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            return undefined;
        }
        return BudgetModel.create({ userId: user.id, category: category, amount: amount });

    }

    async deleteBudget(username: string, id: number): Promise<boolean> {
        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            throw new Error("User not found");
        }

        await BudgetModel.destroy({ where: { userId: user.id, id: id } });

        return true;
    }
    /*
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
    
    
        async removeBudgetExpense(username: string, id: string): Promise<Budget> {
            const user: User | undefined = await this.userService.findUser(username);
            if (!user) {
                throw new Error("User not found");
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
        }*/

    //TODO fix addBudgetExpense and removeBudgetExpense through new implementation
}

