import { Expense } from "./expense.interface";

export interface Budget {
    category : string;
    cost : number;
    expenses : Expense[];
    result : number;
}

