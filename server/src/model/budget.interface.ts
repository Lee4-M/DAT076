import { Expense } from "./expense.interface";

export interface Budget {
    category : string;
    cost : number;
    expense : Expense[];
    result : number;
}

