import { Budget } from "../model/budget.interface";
import { BudgetService } from "./budget";
import { UserService } from "./user";

const username = "User";
const password = "Password";

let userService: UserService;
let budgetService: BudgetService;

beforeAll(async () => {
    userService = new UserService();
    budgetService = new BudgetService(userService);
    await userService.createUser(username, password);
});

beforeEach(async () => {
    await budgetService.resetBudgets(username);
});

describe("Budget Service", () => {
    test("If a budget is added, it should appear in the list", async () => {
        const category = "Clothes";
        const cost = 500;

        await budgetService.addBudget(username, category, cost);

        const budgets: Budget[] | undefined = await budgetService.getBudgets(username);

        expect(budgets?.some(budget => budget.category === category && budget.cost === cost)).toBeTruthy();
    });
});

describe("Delete Budget", () => {
    test("An added budget to an empty list can be deleted successfully", async() =>{
        const category = "Groceries";
        const cost = 1000;

        await budgetService.addBudget(username, category, cost);
        await budgetService.deleteBudget(username, category);

        const budgets: Budget[] | undefined = await budgetService.getBudgets(username);
        expect(budgets && budgets.length === 0).toBeTruthy();
    })
});
