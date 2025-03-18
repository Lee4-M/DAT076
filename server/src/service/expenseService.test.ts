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

    describe("Adding expenses", () => {
        test("Adding an expense to an existing budget row should return the new expense", async () => {
            expect(await expenseService.addExpense("User", "Clothes", 100, "Shirt")).toEqual(
                expect.objectContaining({ cost: 100, description: "Shirt" })
            );
        });

        test("Adding an expense to a non-existent budget row should create the budget row and add the expense", async () => {
            expect(await expenseService.addExpense("User", "Food", 200, "Lunch")).toEqual(
                expect.objectContaining({ cost: 200, description: "Lunch" })
            );
        });

        test("Adding an expense with a negative cost should return undefined", async () => {
            expect(await expenseService.addExpense("User", "Clothes", -100, "Invalid Expense")).toBeUndefined();
        });

        test("Adding an expense for a non-existent user should return undefined", async () => {
            expect(await expenseService.addExpense("NonExistentUser", "Clothes", 100, "Shirt")).toBeUndefined();
        });
    });

    describe("Deleting expenses", () => {
        test("Deleting an existing expense should reflect in the expense database table", async () => {
            const expense = await expenseService.addExpense("User", "Clothes", 100, "Shirt");
            const result = await expenseService.deleteExpense(expense!.id);
            expect(result).toBe(true);
        });

        test("Deleting a non-existent expense should return false", async () => {
            const result = await expenseService.deleteExpense(999);
            expect(result).toBe(false);
        });

        test("Deleting an expense with a negative id should return false", async () => {
            const result = await expenseService.deleteExpense(-1);
            expect(result).toBe(false);
        });
    });

    describe("Updating expenses", () => {
        test("Updating an existing expense should reflect in the expense database table", async () => {
            const expense = await expenseService.addExpense("User", "Clothes", 100, "Shirt");
            const updatedExpense = await expenseService.updateExpense(expense!.id, 200, "Jacket");
            expect(updatedExpense).toEqual(expect.objectContaining({ cost: 200, description: "Jacket" }));
        });

        test("Updating a non-existent expense should return undefined", async () => {
            const updatedExpense = await expenseService.updateExpense(999, 200, "Jacket");
            expect(updatedExpense).toBeUndefined();
        });

        test("Updating an expense with a negative id should return undefined", async () => {
            const updatedExpense = await expenseService.updateExpense(-1, 200, "Jacket");
            expect(updatedExpense).toBeUndefined();
        });

        test("Updating an expense with a negative cost should return undefined", async () => {
            const expense = await expenseService.addExpense("User", "Clothes", 100, "Shirt");
            const updatedExpense = await expenseService.updateExpense(expense!.id, -200, "Jacket");
            expect(updatedExpense).toBeUndefined();
        });

        test("Updating an expense with a non-existent id should return undefined", async () => {
            const updatedExpense = await expenseService.updateExpense(999, 200, "Jacket");
            expect(updatedExpense).toBeUndefined();
        });
    });
});