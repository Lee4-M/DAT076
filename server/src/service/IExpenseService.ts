import { Expense } from "../model/expense.interface"

export interface IExpenseService {
  getExpenses(budgetRowId: number): Promise<Expense[] | undefined>

  addExpense(username: String, category: String, cost: number, description: String): Promise<Expense | undefined>

  removeExpense(username: String, id: String): Promise<number>
}