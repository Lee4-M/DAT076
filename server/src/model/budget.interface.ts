import { Expense } from "./expense.interface";

// Invariant: result === cost - sum of expenses
export interface Budget {
    category: string;
    cost: number;
    expenses: Expense[];
    result: number;
}

