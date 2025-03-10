import { BudgetRowService } from "./budget";
import { UserService } from "./user";

let userService: UserService;
let budgetService: BudgetRowService;

beforeAll(() => {
    userService = new UserService();
    budgetService = new BudgetRowService(userService);
});

beforeEach(() => {
    return userService.createUser("User", "Password");
});

describe("Budget Service", () => {
    describe("Getting budget rows", () => {
        test("Getting budget rows for a user should return an array of budget rows", async () => {
            await budgetService.addBudgetRow("User", "Clothes", 500);
            await budgetService.addBudgetRow("User", "Food", 300);

            const budgets = await budgetService.getBudgetRows("User");
            expect(budgets).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ category: "Clothes", amount: 500 }),
                    expect.objectContaining({ category: "Food", amount: 300 }),
                ])
            );
        });

        test("Getting budget rows for a non-existent user should return undefined", async () => {
            const budgets = await budgetService.getBudgetRows("NonExistentUser");
            expect(budgets).toBeUndefined();
        });

        test("Getting budget rows for a user with no budget rows should return an empty array", async () => {
            const budgets = await budgetService.getBudgetRows("User");
            expect(budgets).toEqual([]);
        });

        test("Getting a budget row for an empty username string should return undefined", async () => {
            const budgets = await budgetService.getBudgetRows("");
            expect(budgets).toBeUndefined();
        });
    });

    describe("Finding a budget row", () => {
        test("Finding a budget row for a user should return the budget row", async () => {
            await budgetService.addBudgetRow("User", "Clothes", 500);

            const budget = await budgetService.findBudgetRow("User", "Clothes");
            expect(budget).toEqual(expect.objectContaining({ category: "Clothes", amount: 500 }));
        });

        test("Finding a budget row for a user with no budget rows should return undefined", async () => {
            const budget = await budgetService.findBudgetRow("User", "Clothes");
            expect(budget).toBeUndefined();
        });

        test("Finding a budget row for a non-existent category should return undefined", async () => {
            await budgetService.addBudgetRow("User", "Clothes", 500);
        });

        test("Finding a budget row for a non-existent user should return undefined", async () => { 
            const budget = await budgetService.findBudgetRow("NonExistentUser", "Clothes");
            expect(budget).toBeUndefined();
        });

        test("Finding a budget row for an empty username should return undefined", async () => {
            const budget = await budgetService.findBudgetRow("", "Clothes");
            expect(budget).toBeUndefined();
        });
    });

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
            const budget = await budgetService.addBudgetRow("User", "Clothes", 500);
            await budgetService.deleteBudgetRow("User", budget!.id);

            const budgets = await budgetService.getBudgetRows("User");
            expect(budgets).toEqual([]);
        });

        test("Deleting a budget row for a non-existent user should return false", async () => {
            console.log(budgetService.getBudgetRows("User"));
            const budget = await budgetService.addBudgetRow("User", "Clothes", 500);
            const result = await budgetService.deleteBudgetRow("NonExistentUser", budget!.id);
            expect(result).toBe(false);
        });

        test("Deleting a budget row that does not exist should return false", async () => {
            const result = await budgetService.deleteBudgetRow("User", 999);
            expect(result).toBe(false);
        });

        test("Deleting a budget row with an empty username should return false", async () => {
            const result = await budgetService.deleteBudgetRow("", 1);
            expect(result).toBe(false);
        });

        test("Deleting a budget row with a negative id should return false", async () => {
            const result = await budgetService.deleteBudgetRow("User", -1);
            expect(result).toBe(false);
        });
    });
});


  