import { BudgetRowModel } from "../db/budgetRow.db";
import { BudgetRow } from "../model/budgetRow.interface";
import { IBudgetRowService } from "./IBudgetRowService";
import { User } from "../model/user.interface";
import { UserService } from "./user";

export class BudgetRowService implements IBudgetRowService {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async getBudgetRows(username: string): Promise<BudgetRow[] | undefined> {
        if (!username) {
            console.error("Invalid input: username");
            return undefined;
        }
        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            console.warn(`User not found: ${username}`);
            return undefined;
        }
        return await BudgetRowModel.findAll({ where: { userId: user.id } });
    }

    async findBudgetRow(username: string, category: string): Promise<BudgetRow | undefined> {
        if (!username || !category) {
            console.error("Invalid input: username or category");
            return undefined;
        }

        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            console.warn(`User not found: ${username}`);
            return undefined;
        }
        const budgetRow = await BudgetRowModel.findOne({ where: { userId: user.id, category: category} });
        return budgetRow ?? undefined;
    }

    async addBudgetRow(username: string, category: string, amount: number): Promise<BudgetRow | undefined> {
        if (!username || !category || amount < 0) {
            console.error("Invalid input: username, category, or amount");
            return undefined;
        }

        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            console.warn(`User not found: ${username}`);
            return undefined;
        }
        return await BudgetRowModel.create({ userId: user.id, category: category, amount: amount });
    }

    async deleteBudgetRow(username: string, id: number): Promise<boolean> {
        if(!username || id < 0) {
            console.error("Invalid input: username or id");
            return false;
        }

        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            console.warn(`User not found: ${username}`);
            return false;
        }

        const budgetRow = await BudgetRowModel.findOne({ where: { userId: user.id, id: id } });
        if (!budgetRow) {
            console.warn(`Budget row not found: ID ${id} for user ${username}`);
            return false;
        }

        await budgetRow.destroy();

        return true;
    }

    async updateBudget(username: string, category: string, cost: number): Promise<Budget | undefined> {
        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            return undefined;
        }

        const budget = user.budgets.find(budget => budget.category === category);
        if (!budget) {
            return undefined;
        }

        budget.cost = cost;
        budget.result = cost - budget.expenses.reduce((sum, expense) => sum + expense.cost, 0);
        
        return { ...budget };
    }

    async updateAllBudgets(username: string, categories: string[], amounts: number[]): Promise<Budget[] | undefined> {
        console.log("reached hereeeeee2")
        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            return undefined;
        }
        

        let newBudgets: Budget[] = [];
        

        categories.forEach((c, i) => {
            console.log("reached here")
            const budget = user.budgets.find(budget => budget.category === c);
            if (!budget) {
                return undefined;
            }
            budget.cost = amounts[i];
            console.log(budget.cost);
            budget.result = amounts[i] - budget.expenses.reduce((sum, expense) => sum + expense.cost, 0);
            newBudgets.push(budget);
        });

        return { ...newBudgets };
    }
}

