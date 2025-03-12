import { BudgetRow } from "../../model/budgetRow.interface"
import { Expense } from "../../model/expense.interface"

export interface IBudgetRowService {

  getBudgetRows(username: string): Promise<BudgetRow[] | undefined>

  addBudgetRow(username: string, category: string, cost: number, expense?: Expense): Promise<BudgetRow | undefined>

  deleteBudgetRow(username: string, id: number): Promise<boolean>

}