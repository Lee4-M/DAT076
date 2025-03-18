import { Expense } from "../model/expense.interface";
import { IExpenseService } from "./interface/IExpenseService";
import { ExpenseModel } from "../db/expense.db";
import { BudgetRowModel } from "../db/budgetRow.db";
import { BudgetRowService } from "./budget";

/**
 * Service class for managing expenses.
 */
export class ExpenseService implements IExpenseService {
    private budgetRowService: BudgetRowService;

    constructor(budgetRowService: BudgetRowService) {
        this.budgetRowService = budgetRowService;
    }

    /**
     * Retrieves all expenses for a budget from the database.
     * 
     * @param
     * @returns - An array of expenses associated with the provided budget.
     * Returns 'undefine' if no budget is found. 
     *    
     */

    async getExpenses(budgetRowId: number): Promise<Expense[] | undefined> {
        const budgetRow = await this.budgetRowService.findBudgetRowById(budgetRowId);
        if (!budgetRow) {
            console.error(`Budget row not found: ${budgetRowId}`);
            return undefined;
        }

        return await ExpenseModel.findAll({ where: { budgetRowId: budgetRowId } });
    }

    /**
     * Creates and adds an ExpenseModel object for a budget to the database. 
     * 
     * @param username - Username of active user
     * @param category - Budget category name
     * @param cost - Amount of expense
     * @param description - Description of expense
     * @returns - Creates ExpenseModel object to a budget, returns 'undefined' if input 
     * is invalid (no username or cost)
     * 
     */

    async addExpense(username: string, category: string, cost: number, description: string): Promise<Expense | undefined> {
        if (!username || !category || cost < 0) {
            console.error("Invalid input: username, category, cost, or description: ", username, category, cost, description);
            return undefined;
        }

        let budgetRow = await this.budgetRowService.findBudgetRowByCategory(username, category);
        if (!budgetRow) {
            const newBudgetRow = await this.budgetRowService.addBudgetRow(username, category, 0);
            if (!newBudgetRow) return undefined;
            budgetRow = newBudgetRow as BudgetRowModel;
        }

        return ExpenseModel.create({ budgetRowId: budgetRow.id, cost: cost, description: description });
    }


    /**
     * Delets an expense from the database. 
     * 
     * @param id - Identifier of expense
     * @returns -  A boolean, false if the ID is invalid or the expense does not exist. 
     * True when expense is successfully destroyed
     * 
     */

    async deleteExpense(id: number): Promise<boolean> {
        if (id < 0) {
            console.error("Invalid input: id");
            return false;
        }

        const expense = await ExpenseModel.findOne({ where: { id: id } });
        if (!expense) {
            console.warn(`Expense not found: ${id}`);
            return false;
        }

        await expense.destroy();
        return true;
    }

    /**
     * Updates an expense with provided values. 
     * 
     * @param id - Identifier of expense
     * @param cost - Amount of expense
     * @param description - Description of expense
     * @param budgetRowId - Identifier of expense's budget. 
     * @returns - Updated expense object if successful, or 'undefined' 
     * if the expense is not found or input is invalid.
     */

    async updateExpense(id: number, cost: number, description: string, budgetRowId?: number): Promise<Expense | undefined> {
        if (id < 0 || cost < 0) {
            console.error("Invalid input: id or cost");
            return undefined;
        }

        const expense = await ExpenseModel.findOne({ where: { id: id } });
        if (!expense) {
            console.warn(`Expense not found: ${id}`);
            return undefined;
        }

        await expense.update({ budgetRowId: budgetRowId, cost: cost, description: description });

        return expense;
    }
}
