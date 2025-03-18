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

const testUser = { username: "User", password: "Password" };

beforeAll(() => {
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
    await agent.post("/user").send(testUser).expect(201);
    await agent.post("/user/login").send(testUser).expect(200);
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("Expense API Tests", () => {
    describe("GET /expense/:budgetRowId", () => {
        test("Successfully get a list of expenses", async () => {
            const addBudgetResponse = await agent.post("/budget").send({ category: "Groceries", amount: 1000 }).expect(201);
            const addExpenseResponse = await agent.post("/expense").send({ category: "Groceries", cost: 1000, description: "Bought some groceries" }).expect(201);

            const response = await agent.get(`/expense/${addBudgetResponse.body.id}`).expect(200);
            expect(response.body).toEqual([
                { description: "Bought some groceries", cost: 1000, id: addExpenseResponse.body.id, budgetRowId: addBudgetResponse.body.id },
            ]);
        });

        test("Unsuccessfully get empty expenses for user", async () => {
            const addBudgetResponse = await agent.post("/budget").send({ category: "Groceries", amount: 1000 }).expect(201);

            const response = await agent.get(`/expense/${addBudgetResponse.body.id}`).expect(200);
            expect(response.body).toEqual([]);
        });

        test("Unsuccessfully get expenses if budgetRowId is not a number", async () => {
            await agent.get(`/expense/a`).expect(400);
        });

        test("Unsuccessfully get expenses if user is not logged in", async () => {
            await agent.post("/user/logout").expect(200);
            await agent.get("/expense/1").expect(401, "Not logged in");
        });

        test("Handle internal server error gracefully", async () => {
            jest.spyOn(expenseService, "getExpenses").mockRejectedValue(new Error("Database error"));
            await agent.get("/expense/1").expect(500, "Database error");
        });
    });

    describe("POST /expense", () => {
        test("Successfully add an expense", async () => {
            const addBudgetResponse = await agent.post("/budget").send({ category: "Groceries", amount: 1000 }).expect(201);
            const addExpenseResponse = await agent.post("/expense").send({ category: "Groceries", cost: 1000, description: "Bought some groceries" }).expect(201);
            expect(addExpenseResponse.body).toEqual({ id: addExpenseResponse.body.id, budgetRowId: addBudgetResponse.body.id, cost: 1000, description: "Bought some groceries" });
        });

        test("Unsuccessfully add an expense if category is not a string", async () => {
            await agent.post("/expense").send({ category: 1, cost: 1000, description: "Bought some groceries" }).expect(400);
        });

        test("Unsuccessfully add an expense if user is not logged in", async () => {
            await agent.post("/user/logout").expect(200);
            await agent.post("/expense").send({ category: "Groceries", cost: 1000, description: "Bought some groceries" }).expect(401);
        });

        test("Handle internal server error gracefully", async () => {
            jest.spyOn(expenseService, "addExpense").mockRejectedValue(new Error("Database error"));
            await agent.post("/expense").send({ category: "Groceries", cost: 1000, description: "Bought some groceries" }).expect(500, "Database error");
        });
    });

    describe("DELETE /expense/:id", () => {
        test("Successfully delete an expense", async () => {
            await agent.post("/budget").send({ category: "Groceries", amount: 1000 }).expect(201);
            const addExpenseResponse = await agent.post("/expense").send({ category: "Groceries", cost: 1000, description: "Bought some groceries" }).expect(201);
            await agent.delete(`/expense/${addExpenseResponse.body.id}`).expect(200);
        });

        test("Unsuccessfully delete an expense if id is not a number", async () => {
            await agent.delete(`/expense/a`).expect(400);
        });

        test("Unsuccessfully delete an expense if user is not logged in", async () => {
            await agent.post("/user/logout").expect(200);
            await agent.delete(`/expense/1`).expect(401, "Not logged in");
        });

        test("Handle internal server error gracefully", async () => {
            jest.spyOn(expenseService, "deleteExpense").mockRejectedValue(new Error("Database error"));
            await agent.post("/budget").send({ category: "Groceries", amount: 1000 }).expect(201);
            const addExpenseResponse = await agent.post("/expense").send({ category: "Groceries", cost: 1000, description: "Bought some groceries" }).expect(201);
            await agent.delete(`/expense/${addExpenseResponse.body.id}`).expect(500, "Database error");
        });
    });

    describe("PUT /expense", () => {
        test("Successfully update an expense", async () => {
            await agent.post("/budget").send({ category: "Groceries", amount: 1000 }).expect(201);
            const addExpenseResponse = await agent.post("/expense").send({ category: "Groceries", cost: 1000, description: "Bought some groceries" }).expect(201);
            const updateExpenseResponse = await agent.put(`/expense/${addExpenseResponse.body.id}`).send({ cost: 2000, description: "Bought more groceries" }).expect(200);
            expect(updateExpenseResponse.body).toEqual({ id: addExpenseResponse.body.id, budgetRowId: addExpenseResponse.body.budgetRowId, cost: 2000, description: "Bought more groceries" });
        });

        test("Unsuccessfully update an expense with invalid id", async () => {
            await agent.put("/expense/a").send({ cost: 2000, description: "Bought more groceries" }).expect(400);
        });

        test("Unsuccessfully update an expense with invalid cost", async () => {
            await agent.post("/budget").send({ category: "Groceries", amount: 1000 }).expect(201);
            const addExpenseResponse = await agent.post("/expense").send({ category: "Groceries", cost: 1000, description: "Bought some groceries" }).expect(201);
            await agent.put(`/expense/${addExpenseResponse.body.id}`).send({ cost: "a", description: "Bought more groceries" }).expect(400);
        });

        test("Unsuccessfully update an expense with invalid description", async () => {
            await agent.post("/budget").send({ category: "Groceries", amount: 1000 }).expect(201);
            const addExpenseResponse = await agent.post("/expense").send({ category: "Groceries", cost: 1000, description: "Bought some groceries" }).expect(201);
            await agent.put(`/expense/${addExpenseResponse.body.id}`).send({ cost: 2000, description: 1 }).expect(400);
        });

        test("Unsuccessfully update an expense if user is not logged in", async () => {
            await agent.post("/user/logout").expect(200);
            await agent.put(`/expense/1`).send({ cost: 2000, description: "Bought more groceries" }).expect(401, "Not logged in");
        });

        test("Unsuccessfully update a non-existent expense", async () => {
            await agent.put(`/expense/999`).send({ cost: 2000, description: "Bought more groceries" }).expect(404, "Expense not found");
        });

        test("Handle internal server error gracefully", async () => {
            jest.spyOn(expenseService, "updateExpense").mockRejectedValue(new Error("Database error"));
            await agent.post("/budget").send({ category: "Groceries", amount: 1000 }).expect(201);
            const addExpenseResponse = await agent.post("/expense").send({ category: "Groceries", cost: 1000, description: "Bought some groceries" }).expect(201);
            await agent.put(`/expense/${addExpenseResponse.body.id}`).send({ cost: 2000, description: "Bought more groceries" }).expect(500, "Database error");
        });
    });
});