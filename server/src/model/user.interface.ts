import { Budget } from "./budget.interface";
import { Expense } from "./expense.interface";

export interface User {
    userId: number;
    username: string;
    password: string;
    budgets: Budget[];
    expenses: Expense[];
}
