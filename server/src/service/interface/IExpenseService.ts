import { Expense } from "../../model/expense.interface"

export interface IExpenseService {
  getExpenses(budgetRowId: number): Promise<Expense[] | undefined>

  addExpense(username: string, category: string, cost: number, description: string): Promise<Expense | undefined>

  deleteExpense(id: number): Promise<boolean>
}