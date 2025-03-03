import { Budget } from "../model/budget.interface"
import { Expense } from "../model/expense.interface"

export interface IBudgetService {

    getBudgets(username: String): Promise<Budget[]>

    addBudget(username: String, category: String, cost: number, expense?: Expense): Promise<Budget>
  
    // Marks the task with the given id number as done, and returns true
    // Returns false if there is no task with that id number
    // If the task is already done, this method performs no operation and returns true
    deleteBudget(username: String, category: String): Promise<boolean>

  }