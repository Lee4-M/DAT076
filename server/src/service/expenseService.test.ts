import e from "express";
import { BudgetRowService } from "./budget";
import { ExpenseService } from "./expense";
import { UserService } from "./user";
import { BudgetRow } from "../model/budgetRow.interface";

let userService: UserService;
let budgetRowService: BudgetRowService;
let expenseService: ExpenseService;
let budget: BudgetRow | undefined;

beforeAll(() => {
    userService = new UserService();
    budgetRowService = new BudgetRowService(userService);
    expenseService = new ExpenseService(budgetRowService);
});

beforeEach(async () => {
    await userService.createUser("User", "Password");
    budget = await budgetRowService.addBudgetRow("User", "Clothes", 500);
});

describe("Expense Service", () => {
    describe("Getting expenses", () => {
        test("Getting expenses for a budget row should return an array of expenses", async () => { 
            await expenseService.addExpense("User", "Clothes", 100, "Shirt");
            await expenseService.addExpense("User", "Clothes", 200, "Pants");
            expect(await expenseService.getExpenses(budget!.id)).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ cost: 100, description: "Shirt" }),
                    expect.objectContaining({ cost: 200, description: "Pants" }),
                ])
            );
        });

        test("Getting expenses for a non-existent budget row should return undefined", async () => {
            expect(await expenseService.getExpenses(999)).toBeUndefined();
        });
        
        test("Getting expenses for a budget row with no expenses should return an empty array", async () => {
            expect(await expenseService.getExpenses(budget!.id)).toEqual([]);
        });
    });
});