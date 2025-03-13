import request from "supertest";
import express from "express";
import session from "express-session";
import { ExpenseService } from "../service/expense";
import { UserService } from "../service/user";
import { expenseRouter } from "./expense";
import { userRouter } from "./user";
import { BudgetRowService } from "../service/budget";
import { budgetRowRouter } from "./budget";

let app: express.Application;
let budgetRowService: BudgetRowService;
let expenseService: ExpenseService;
let userService: UserService;
let agent: ReturnType<typeof request.agent>;

const username = "User";
const password = "Password";

beforeAll(async () => {
    userService = new UserService();
    budgetRowService = new BudgetRowService(userService);
    expenseService = new ExpenseService(budgetRowService);

    app = express();
    app.use(express.json());
    app.use(
        session({
            secret: "test_secret",
            resave: false,
            saveUninitialized: true,
        })
    );
    app.use(expenseRouter(expenseService));
    app.use(budgetRowRouter(budgetRowService));
    app.use(userRouter(userService));
});

beforeEach(async () => {
    agent = request.agent(app);
    await agent.post("/user").send({ username, password }).expect(201);
    await agent.post("/user/login").send({ username, password }).expect(200);
});

describe("Expense API Tests", () => {
    describe("GET /expense", () => {
        test("Successfully get a list of expenses", async () => {
            const category = "Groceries";
            const amount = 1000;
            const cost = 1000;
            const description = "Bought some groceries";

            const addBudgetResponse = await agent.post("/budget").send({ category, amount }).expect(201);

            const addExpenseResponse = await agent.post("/expense").send({ category, cost, description }).expect(201);

            const response = await agent.get("/expense").query({ budgetRowId: 1 }).expect(200);
            expect(response.body).toEqual([
                { id: addExpenseResponse.body.id, budgetRowId: addBudgetResponse.body.id, cost, description },
            ]);
        });

        test("Unsuccessfully get empty expenses for user", async () => {
            const response1 = await agent.get("/budget").expect(200);
            expect(response1.body).toEqual([]);
            await agent.post("/budget").send({ category: "Groceries", amount: 1000 }).expect(201);

            const response = await agent.get("/expense").query({ budgetRowId: 1 });
            expect(response.body).toEqual([]);
        });

        test("Unsuccessfully get expenses if budgetRowId is not a number", async () => {
            const response = await agent.get("/expense").query({ budgetRowId: "a" }).expect(400);
            expect(response.text).toEqual("Bad GET call to /expense?budgetRowId=a --- budgetRowId is missing or not a number");
        });

        test("Unsuccessfully get expenses if user is not logged in", async () => {
            await agent.post("/user/logout").expect(200);
            const response = await agent.get("/expense").query({ budgetRowId: 1 }).expect(401);
            expect(response.text).toEqual("Not logged in");
        });

        test("Handle internal server error gracefully", async () => {
            jest.spyOn(expenseService, "getExpenses").mockRejectedValue(new Error("Database error"));

            const response = await agent.get("/expense").query({ budgetRowId: 1 }).expect(500);

            expect(response.text).toBe("Database error");

            (expenseService.getExpenses as jest.Mock).mockRestore();
        });
    });

    describe("POST /expense", () => {
        test("Successfully add an expense", async () => {
            const category = "Groceries";
            const amount = 1000;
            const cost = 1000;
            const description = "Bought some groceries";

            const addBudgetResponse = await agent.post("/budget").send({ category, amount }).expect(201);
            const addExpenseResponse = await agent.post("/expense").send({ category, cost, description }).expect(201);
            expect(addExpenseResponse.body).toEqual({ id: addExpenseResponse.body.id, budgetRowId: addBudgetResponse.body.id, cost, description });
        });

        test("Unsuccessfully add an expense if category is not a string", async () => {
            const cost = 1000;
            const description = "Bought some groceries";
            const response = await agent.post("/expense").send({ category: 1, cost, description }).expect(400);
            expect(response.text).toEqual("Bad PUT call to /expense --- category has type number or cost has type number or description has type string");
        });

        test("Unsuccessfully add an expense if user is not logged in", async () => {
            await agent.post("/user/logout").expect(200);
            const response = await agent.post("/expense").send({ category: "Groceries", cost: 1000, description: "Bought some groceries" }).expect(401);
            expect(response.text).toEqual("Not logged in");
        });

        test("Handle internal server error gracefully", async () => {
            const category = "Groceries";
            const cost = 1000;
            const description = "Bought some groceries";
            jest.spyOn(expenseService, "addExpense").mockRejectedValue(new Error("Database error"));

            const response = await agent.post("/expense").send({ category, cost, description }).expect(500);

            expect(response.text).toBe("Database error");

            (expenseService.addExpense as jest.Mock).mockRestore();
        });
    });

    describe("DELETE /expense", () => {
        test("Successfully delete an expense", async () => {
            const category = "Groceries";
            const amount = 1000;
            const cost = 1000;
            const description = "Bought some groceries";

            await agent.post("/budget").send({ category, amount }).expect(201);
            const addExpenseResponse = await agent.post("/expense").send({ category, cost, description }).expect(201);

            await agent.delete("/expense").send({ id: addExpenseResponse.body.id }).expect(200);
        });

        test("Unsuccessfully delete an expense if id is not a number", async () => {
            const response = await agent.delete("/expense").send({ id: "a" }).expect(400);
            expect(response.text).toEqual("Bad DELETE call to /expense --- id has type string");
        });

        test("Unsuccessfully delete an expense if user is not logged in", async () => {
            await agent.post("/user/logout").expect(200);
            const response = await agent.delete("/expense").send({ id: 1 }).expect(401);
            expect(response.text).toEqual("Not logged in");
        });

        test("Handle internal server error gracefully", async () => {
            const category = "Groceries";
            const cost = 1000;
            const amount = 1000;
            const description = "Bought some groceries";
            jest.spyOn(expenseService, "deleteExpense").mockRejectedValue(new Error("Database error"));

            await agent.post("/budget").send({ category, amount }).expect(201);
            const addExpenseResponse = await agent.post("/expense").send({ category, cost, description }).expect(201);

            const response = await agent.delete("/expense").send({ id: addExpenseResponse.body.id }).expect(500);

            expect(response.text).toBe("Database error");

            (expenseService.deleteExpense as jest.Mock).mockRestore();
        });
    });
});