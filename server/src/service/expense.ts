import { Expense } from "../model/expense.interface";
import { IExpenseService } from "./IExpenseService";
import { ExpenseModel } from "../db/expense.db";
import { BudgetRowModel } from "../db/budgetRow.db";
import { BudgetRowService } from "./budget";

export class ExpenseService implements IExpenseService {
    private budgetRowService: BudgetRowService;

    constructor(budgetRowService: BudgetRowService) {
        this.budgetRowService = budgetRowService;
    }

    async getExpenses(budgetRowId: number): Promise<Expense[] | undefined> {
        return await ExpenseModel.findAll({where: { budgetRowId: budgetRowId }});
    }

    async addExpense(username: string, category: string, cost: number, description: string): Promise<Expense | undefined> {
        let budgetRow = await this.budgetRowService.findBudgetRow(username, category);

        if (!budgetRow) {
            const newBudgetRow = await this.budgetRowService.addBudgetRow(username, category, 0);
            if (!newBudgetRow) return undefined;
            budgetRow = newBudgetRow as BudgetRowModel;
        }

        return ExpenseModel.create({ budgetRowId: budgetRow.id, cost: cost, description: description });
    }

    async removeExpense(id: number): Promise<number> {
        const expense = await ExpenseModel.findOne({ where: { id: id } });

        if (!expense) {
            throw new Error("Expense not found");
        }
        return await ExpenseModel.destroy({ where: { id: id } });
    }
}
