import { BudgetRow } from "../model/budgetRow.interface";
import { BudgetRowService } from "./budgetRow";
import { UserService } from "./user";

const username = "User";
const password = "Password";

let userService: UserService;
let budgetRowService: BudgetRowService;

beforeAll(async () => {
    userService = new UserService();
    budgetRowService = new BudgetRowService(userService);
    await userService.createUser(username, password);
});

describe("Budget Row Service", () => {
    test("If a budget is added, it should appear in the list", async () => {
        const category = "Clothes";
        const cost = 500;

        await budgetRowService.addBudget(username, category, cost);

        const budgetRows: BudgetRow[] | undefined = await budgetRowService.getBudgets(username);

        expect(budgetRows?.some(budgetRow => budgetRow.category === category && budgetRow.amount === cost)).toBeTruthy();
    });
});