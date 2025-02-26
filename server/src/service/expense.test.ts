import { BudgetService } from './budget';
import { ExpenseService } from './expense';


const budgetService = new BudgetService(); 
const expenseService = new ExpenseService(budgetService);

const category = "Clothes";
const cost = 500;
const description = "Shirt";

// Add expense
test("if an expense is added it should appear in the array of expenses", async() =>{
    await expenseService.addExpense(category, cost, description);
    const expenses = await expenseService.getExpenses();

    expect(expenses.some(expense => expense.category === "Clothes" && expense.cost === 500 && expense.description === "Shirt")).toBeTruthy();
})

test("should throw an error for invalid category input", async () => {
    await expect(expenseService.addExpense("", 500, "Shirt")).rejects.toThrow("Invalid category");
});

test("should throw an error for invalid cost input", async () => {
    await expect(expenseService.addExpense("Clothes", -500, "Shirt")).rejects.toThrow("Invalid cost");
});

test("should throw an error for invalid description input", async () => {
    await expect(expenseService.addExpense("Clothes", 500, "")).rejects.toThrow("Invalid description");
});

// Remove expense
test("if an expense is removed it should not appear in the array of expenses", async() =>{
    const expenses = await expenseService.getExpenses();
    const expense = expenses[0];

    await expenseService.removeExpense(expense.id);
    const newExpenses = await expenseService.getExpenses();

    expect(newExpenses.some(e => e.id === expense.id)).toBeFalsy();
})

test("should throw an error for non-existant expense", async () => {
    await expect(expenseService.removeExpense("")).rejects.toThrow("Expense not found");
});

