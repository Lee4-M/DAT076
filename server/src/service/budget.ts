import { BudgetRowModel } from "../db/budgetRow.db";
import { BudgetRow } from "../model/budgetRow.interface";
import { User } from "../model/user.interface";
import { IBudgetRowService } from "./interface/IBudgetRowService";
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
        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            console.warn(`User not found: ${username}`);
            return undefined;
        }
        return await BudgetRowModel.findAll({ where: { userId: user.id } });
    }

    async findBudgetRowByCategory(username: string, category: string): Promise<BudgetRow | undefined> {
        if (!username || !category) {
            console.error("Invalid input: username or category");
            return undefined;
        }

        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            console.warn(`User not found: ${username}`);
            return undefined;
        }

        const budgetRow = await BudgetRowModel.findOne({ where: { userId: user.id, category: category } });
        return budgetRow ?? undefined;
    }

    async findBudgetRowById(id: number): Promise<BudgetRow | undefined> {
        if (id < 0) {
            console.error("Invalid input: id");
            return undefined;
        }
        const budgetRow = await BudgetRowModel.findOne({ where: { id: id } });
        return budgetRow ?? undefined;
    }

    async addBudgetRow(username: string, category: string, amount: number): Promise<BudgetRow | undefined> {
        if (!username || !category || amount < 0) {
            console.error("Invalid input: username, category, or amount");
            return undefined;
        }

        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            console.warn(`User not found: ${username}`);
            return undefined;
        }
        return await BudgetRowModel.create({ userId: user.id, category: category, amount: amount });
    }

    async deleteBudgetRow(username: string, id: number): Promise<boolean> {
        if (!username || id < 0) {
            console.error("Invalid input: username or id");
            return false;
        }

        const user: User | undefined = await this.userService.findUser(username);
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

    async updateBudgetRow(username: string, id: number, category: string, amount: number): Promise<BudgetRow | undefined> { //add id argument,
        if (!username || !category || amount < 0) {
            console.error("Invalid input: username, category, or amount");
            return undefined;
        }
        
        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            console.warn(`User not found: ${username}`);
            return undefined;
        }

        const budgetRow = await BudgetRowModel.findOne({ where: { userId: user.id, id: id } });
        if (!budgetRow) {
            return undefined;
        }
        await BudgetRowModel.update({ userId: user.id, category: category, amount: amount }, { where: { id: id } });

        return budgetRow; //TODO Check if this is the old or new budgetRow
        
    }

    async updateAllBudgetRows(username: string, ids: number[], categories: string[], amounts: number[]): Promise<BudgetRow[] | undefined> {
        if (ids.length !== categories.length || ids.length !== amounts.length) {
            console.warn("Mismatched array lengths.");
            return undefined;
        }
        
        const user: User | undefined = await this.userService.findUser(username);
        if (!user) {
            console.warn(`User not found: ${username}`);
            return undefined;
        }
        
        const newBudgets: BudgetRow[] = [];
        
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const budgetRow = await BudgetRowModel.findOne({ where: { userId: user.id, id: id } });
            if (!budgetRow) {
                return undefined;
            }
            const category = categories[i];
            const amount = amounts[i];
            await BudgetRowModel.update({ userId: user.id, category: category, amount: amount }, { where: { id: id } });
            newBudgets.push(budgetRow);
        }

        return newBudgets;
    }
}

