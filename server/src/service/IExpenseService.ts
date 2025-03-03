import { Expense } from "../model/expense.interface"

export interface IExpenseService {
    // Returns a deep copy of the current list of tasks
    getExpenses(username: String): Promise<Expense[]>
  
    // Adds a new task with the given description and returns a copy of that task
    addExpense(username: String, category: String, cost: number, description: String): Promise<Expense>
  
    // Marks the task with the given id number as done, and returns true
    // Returns false if there is no task with that id number
    // If the task is already done, this method performs no operation and returns true
    removeExpense(username: String, id: String): Promise<void>
  }