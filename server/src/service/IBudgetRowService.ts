import { BudgetRow } from "../model/budgetRow.interface"
import { Expense } from "../model/expense.interface"

export interface IBudgetRowService {

  getBudgetRows(username: String): Promise<BudgetRow[] | undefined>

  addBudgetRow(username: String, category: String, cost: number, expense?: Expense): Promise<BudgetRow | undefined>

  deleteBudgetRow(username: String, id: number): Promise<boolean>

}