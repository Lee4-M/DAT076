import { Expense } from "../model/expense.interface";
import { IExpenseService } from "./interface/IExpenseService";
import { ExpenseModel } from "../db/expense.db";
import { BudgetRowModel } from "../db/budgetRow.db";
import { BudgetRowService } from "./budget";

export class ExpenseService implements IExpenseService {
    private budgetRowService: BudgetRowService;

    constructor(budgetRowService: BudgetRowService) {
        this.budgetRowService = budgetRowService;
    }

    async getExpenses(budgetRowId: number): Promise<Expense[] | undefined> {
        const budgetRow = await this.budgetRowService.findBudgetRowById(budgetRowId);
        if (!budgetRow) {
            console.error(`Budget row not found: ${budgetRowId}`);
            return undefined;
        }

        return await ExpenseModel.findAll({ where: { budgetRowId: budgetRowId }});
    }

    async addExpense(username: string, category: string, cost: number, description: string): Promise<Expense | undefined> {
        if(!username || !category || cost < 0 || !description) {
            console.error("Invalid input: username, category, cost, or description");
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
}
