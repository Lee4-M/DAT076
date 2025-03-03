import { Budget } from "../model/budget.interface"
import { Expense } from "../model/expense.interface"

export interface IBudgetService {

  getBudgets(username: String): Promise<Budget[] | undefined>

  addBudget(username: String, category: String, cost: number, expense?: Expense): Promise<Budget | undefined>

  deleteBudget(username: String, id: number): Promise<boolean>

}