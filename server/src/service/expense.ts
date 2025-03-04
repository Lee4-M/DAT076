import { v4 as uuidv4 } from "uuid";
import { Expense } from "../model/expense.interface";
import { User } from "../model/user.interface";
import { IExpenseService } from "./IExpenseService";
import { ExpenseModel } from "../db/expense.db";
import { BudgetRow } from "../model/budgetRow.interface";
import { BudgetRowModel } from "../db/budgetRow.db";
import { BudgetRowService } from "./budgetRow";
import { UserService } from "./user";

export class ExpenseService implements IExpenseService {
    private budgetRowService: BudgetRowService;
    private userService: UserService;

    constructor(budgetService: BudgetRowService, userService: UserService) {
        this.budgetRowService = budgetService;
        this.userService = userService;
    }

    async getExpenses(budgetRowId: number): Promise<Expense[] | undefined> {
        const expenses = await ExpenseModel.findAll({
            where: { budgetRowId: budgetRowId }
        });

        return expenses;
    }

    async addExpense(username: string, category: string, cost: number, description: string): Promise<Expense | undefined> {
        const budgetRow = await BudgetRowModel.findOne({ where: { category: category } });

        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            return undefined;
        }

        if (!budgetRow) {
            const newBudget = await this.budgetRowService.addBudget(username, category, 0,);
            if (!newBudget) {
                return undefined;
            }
            return await ExpenseModel.create({ budgetRowId: newBudget.id, cost: cost, description: description });
        }

        return await ExpenseModel.create({ budgetRowId: budgetRow?.id, cost: cost, description: description });
    }

    async removeExpense(username: string, id: string): Promise<number> {            //Gives the amount of rows deleted
        const expense = await ExpenseModel.findOne({ where: { id: id } });

        if (!expense) {
            throw new Error("Expense not found");
        }
        return await ExpenseModel.destroy({ where: { id: id } });


    }
}
