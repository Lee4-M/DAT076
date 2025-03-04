import { BudgetRow } from "../model/budgetRow.interface"
import { Expense } from "../model/expense.interface"

export interface IBudgetRowService {

  getBudgets(username: String): Promise<BudgetRow[] | undefined>

  addBudget(username: String, category: String, cost: number, expense?: Expense): Promise<BudgetRow | undefined>

  deleteBudget(username: String, id: number): Promise<boolean>

}