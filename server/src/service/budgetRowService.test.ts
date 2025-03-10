// import { BudgetRow } from "../model/budgetRow.interface";
// import { BudgetRowService } from "./budget";
// import { UserService } from "./user";

import sequelize from "sequelize";
import { BudgetRowService } from "./budget";
import { UserService } from "./user";
import { before } from "node:test";

// const username = "User";
// const password = "Password";

// let userService: UserService;
// let budgetService: BudgetRowService;

// beforeAll(async () => {
//     userService = new UserService();
//     budgetService = new BudgetRowService(userService);
//     await userService.createUser(username, password);
// });

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

let userService: UserService;
let budgetService: BudgetRowService;

beforeAll(() => {
    userService = new UserService();
    budgetService = new BudgetRowService(userService);
    return userService.createUser("User", "Password");
});

describe("Budget Service", () => {
    describe("Adding a budget row", () => {
        test("Adding a budget row should reflect in the budgetRows database table", async () => {
            await budgetService.addBudgetRow("User", "Clothes", 500);

            const budgets = await budgetService.getBudgetRows("User");
            expect(budgets).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ category: "Clothes", amount: 500 }),
                ])
            );
        });

        test("Adding a budget row with a negative amount should return undefined", async () => {
            const result = await budgetService.addBudgetRow("User", "Clothes", -500);
            expect(result).toBeUndefined();
        });

        test("Adding a budget row for a non-existent user should return undefined", async () => {
            const result = await budgetService.addBudgetRow("NonExistentUser", "Food", 300);
            expect(result).toBeUndefined();
        });

        test("Adding a budget row with an empty category should return undefined", async () => {
            const result = await budgetService.addBudgetRow("User", "", 100);
            expect(result).toBeUndefined();
        });
    });

    describe("Deleting a budget row", () => {
        test("Deleting a budget row should reflect in the budgetRows database table", async () => {
            await budgetService.addBudgetRow("User", "Clothes", 500);
            await budgetService.deleteBudgetRow("User", "Clothes");

            const budgets = await budgetService.getBudgetRows("User");
            expect(budgets).toEqual([]);
        });

        test("Deleting a budget row for a non-existent user should return false", async () => {
            const result = await budgetService.deleteBudgetRow("NonExistentUser", "Clothes");
            expect(result).toBe(false);
        });

        test("Deleting a budget row that does not exist should return false", async () => {
            await budgetService.addBudgetRow("User", "Clothes", 500);
            const result = await budgetService.deleteBudgetRow("User", "Food");
            expect(result).toBe(false);
        });
    }
});


  