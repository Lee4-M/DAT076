import { BudgetRowModel } from "../db/budgetRow.db";
import { BudgetRow } from "../model/budgetRow.interface";
import { Expense } from "../model/expense.interface";
import { User } from "../model/user.interface";
import { IBudgetRowService } from "./IBudgetRowService";
import { UserService } from "./user";

export class BudgetRowService implements IBudgetRowService {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async getBudgets(username: string): Promise<BudgetRow[] | undefined> {
        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            return undefined
        }
        return await BudgetRowModel.findAll({ where: { userId: user.id } });
    }

    async addBudget(username: string, category: string, amount: number): Promise<BudgetRow | undefined> {
        // Assuming we add expenses after adding a budget row
        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            return undefined;
        }
        return await BudgetRowModel.create({ userId: user.id, category: category, amount: amount });

    }

    async deleteBudget(username: string, id: number): Promise<boolean> {
        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            throw new Error("User not found");
        }

        await BudgetRowModel.destroy({ where: { userId: user.id, id: id } });

        return true;
    }
}

