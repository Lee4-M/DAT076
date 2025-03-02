import { BudgetService } from "../service/budget";
import { userService } from "../start";
import { app } from "../start";
import request from "supertest";

const username: string = "User";
const password: string = "Password";

let budgetService: BudgetService;
let agent: ReturnType<typeof request.agent>;

beforeAll(async () => {
    budgetService = new BudgetService(userService);
    await userService.createUser(username, password);
});

beforeEach(async () => {
    await budgetService.resetBudgets(username);

    agent = request.agent(app);

    await agent
        .post("/user/login")
        .send({ username, password })
        .expect(200);
});

describe("Delete Budget", () => {
    test("Budget deleted successfully", async () => {
        const category = "Groceries";
        const cost = 1000;
    
        await budgetService.addBudget(username, category, cost);
    
        await agent
            .delete("/budget")
            .send({ category: "Groceries" })
            .expect(200);
    });

    test("Wrong budget item attempted to be deleted", async() =>{
        const category = "Groceries";
        const cost = 1000;
    
        await budgetService.addBudget(username, category, cost);
    
        await agent
            .delete("/budget")
            .send({ category: "not-existing" })
            .expect(404);
    })
    
});