import { UserService } from './user';
import { ExpenseService } from './expense';
import { BudgetRowService } from './budgetRow';

const username = "User";
const password = "Password";

let userService: UserService;
let expenseService: ExpenseService;
let budgetService: BudgetRowService;

const category = "Clothes";
const cost = 500;
const description = "Shirt";

beforeAll(async () => {
    userService = new UserService();
    budgetService = new BudgetRowService(userService);
    expenseService = new ExpenseService(userService, budgetRowService);
    await userService.createUser(username, password);
});

describe("Expense Service", () => {
    describe("Add expense", () => {
        test("if an expense is added it should appear in the array of expenses", async () => {
            await expenseService.addExpense(username, category, cost, description);
            const expenses = await expenseService.getExpenses(username);
            expect(expenses?.some(expense =>
                expense.category === category &&
                expense.cost === cost &&
                expense.description === description
            )).toBeTruthy();
        })

        // TODO: Add error handling to pass these tests.
        // test("should throw an error for invalid category input", async () => {
        //     await expect(expenseService.addExpense(username, "", 500, "Shirt")).rejects.toThrow("Invalid category");
        // });

        // test("should throw an error for invalid cost input", async () => {
        //     await expect(expenseService.addExpense(username, "Clothes", -500, "Shirt")).rejects.toThrow("Invalid cost");
        // });

        // test("should throw an error for invalid description input", async () => {
        //     await expect(expenseService.addExpense(username, "Clothes", 500, "")).rejects.toThrow("Invalid description");
        // });
    });

    describe("Remove expenses", () => {
        test("if an expense is removed it should not appear in the array of expenses", async () => {
            const expense = await expenseService.addExpense(username, category, cost, description);

            if (expense) {
                await expenseService.removeExpense(username, expense.id);
            }
            const newExpenses = await expenseService.getExpenses(username);

            expect(newExpenses && expense && newExpenses.some(e => e.id === expense.id)).toBeFalsy();
        });

        test("should throw an error for non-existant expense", async () => {
            await expect(expenseService.removeExpense(username, "")).rejects.toThrow("Expense not found");
        });
    });
});
