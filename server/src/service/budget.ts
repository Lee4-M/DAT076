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
        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            return undefined
        }
        return await BudgetRowModel.findAll({ where: { userId: user.id } });
    }

    async findBudgetRow(username: string, category: string): Promise<BudgetRow | undefined> {
        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            return undefined;
        }
        const budgetRow = await BudgetRowModel.findOne({ where: { userId: user.id, category: category } });
        return budgetRow ?? undefined;
    }

    async addBudgetRow(username: string, category: string, amount: number): Promise<BudgetRow | undefined> {
        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            return undefined;
        }
        return await BudgetRowModel.create({ userId: user.id, category: category, amount: amount });
    }

    async deleteBudgetRow(username: string, id: number): Promise<boolean> {
        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            throw new Error("User not found");
        }

        await BudgetRowModel.destroy({ where: { userId: user.id, id: id } });

        return true;
    }
}

