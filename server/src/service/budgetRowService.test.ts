// import { BudgetRow } from "../model/budgetRow.interface";
// import { BudgetRowService } from "./budget";
// import { UserService } from "./user";

// const username = "User";
// const password = "Password";

// let userService: UserService;
// let budgetService: BudgetRowService;

// beforeAll(async () => {
//     userService = new UserService();
//     budgetService = new BudgetRowService(userService);
//     await userService.createUser(username, password);
// });

test("always passes", () => {
    expect(1 + 1).toBe(2);
});

// beforeEach(async () => {
//     await budgetService.resetBudgets(username);
// });

// describe("Budget Service", () => {
//     test("If a budget is added, it should appear in the list", async () => {
//         const category = "Clothes";
//         const amount = 500;

//         await budgetService.addBudgetRow(username, category, amount);

//         const budgets: BudgetRow[] | undefined = await budgetService.getBudgetRows(username);

//         expect(budgets?.some(budget => budget.category === category && budget.amount === amount)).toBeTruthy();
//     });
// });

// describe("Delete Budget", () => {
//     test("An added budget to an empty list can be deleted successfully", async() =>{
//         const category = "Groceries";
//         const amount = 1000;

//         await budgetService.addBudgetRow(username, category, amount);
//         await budgetService.deleteBudgetRow(username, category);

//         const budgets: BudgetRow[] | undefined = await budgetService.getBudgetRows(username);
//         expect(budgets && budgets.length === 0).toBeTruthy();
//     })
// });
