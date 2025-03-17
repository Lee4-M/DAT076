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

    /**
     * Retrieves all budget rows associated with a given user.
     * 
     * @param username - Username of user
     * @returns - An array of all BudgetRowModel objects. Returns 'undefined' if user is not valid
     * or if user is not found. 
     * 
     */

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

    /**
     * Finds a budget row by category.
     * 
     * @param username - Username of user
     * @param category - Category of budget to find
     * @returns - The budget row if found, 
     * 'undefined' if no user, or input is invalid (username or category)
     */

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

    /**
     * Finds budget row by ID.
     * 
     * @param id - Identifier of budget row 
     * @returns - The budget row if found, 'undefined' if not found or invalid input
     */

    async findBudgetRowById(id: number): Promise<BudgetRow | undefined> {
        if (id < 0) {
            console.error("Invalid input: id");
            return undefined;
        }
        const budgetRow = await BudgetRowModel.findOne({ where: { id: id } });
        return budgetRow ?? undefined;
    }

    /**
     * Creates and adds a BudgetRow object for a user to the database.
     * 
     * @param username - Username of active user
     * @param category - Category of the budget row
     * @param amount - Amount for the budget row
     * @returns - The created BudgetRow object if successful, 
     * 'undefined' if user is not found or input is invalid (username, category or amount)
     */

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

    /**
     * Deletes a user's BudgetRow object from database 
     * 
     * @param username - Username of the user
     * @param id - Identifier of the budget row to delete
     * @returns - True if the budget row was successfully deleted, false if input is invalid
     * or user not found. 
     */

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

    /**
     * Updates a budget row for a user.
     * 
     * @param username - Username of the user
     * @param id - Identifier of the budget row to update
     * @param category - Category of the budget row
     * @param amount - Amount for the budget row
     * @returns - The updated BudgetRow object if successful, 
     * 'undefined' if user is not found or input is invalid (username, category, or amount)
     * 
     */

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

        await budgetRow.update({ userId: user.id, category: category, amount: amount });

        return budgetRow;
    }
}

