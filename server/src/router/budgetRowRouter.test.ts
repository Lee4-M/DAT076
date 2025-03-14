import request from "supertest";
import express from "express";
import session from "express-session";
import { BudgetRowService } from "../service/budget";
import { budgetRowRouter } from "./budget";
import { UserService } from "../service/user";
import { userRouter } from "./user";

let app: express.Application;
let budgetRowService: BudgetRowService;
let userService: UserService;
let agent: ReturnType<typeof request.agent>;

const testUser = { username: "User", password: "Password" };

beforeAll(() => {
    userService = new UserService();
    budgetRowService = new BudgetRowService(userService);

    app = express();
    app.use(express.json());
    app.use(
        session({
            secret: "test_secret",
            resave: false,
            saveUninitialized: true,
        })
    );
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

describe("BudgetRow API Tests", () => {
    describe("GET /budget", () => {
        test("Successfully get a list of budget rows", async () => {
            const addResponse = await agent.post("/budget").send({ category: "Groceries", amount: 1000 }).expect(201);
            const getResponse = await agent.get("/budget").expect(200);

            expect(getResponse.body).toEqual([
                { category: "Groceries", amount: 1000, id: addResponse.body.id, userId: addResponse.body.userId },
            ]);
        });

        test("Successfully get empty budget rows for user", async () => {
            const response = await agent.get("/budget").expect(200);
            expect(response.body).toEqual([]);
        });

        test("Unsuccessfully get budget rows if user no longer exists", async () => {
            jest.spyOn(userService, "findUser").mockResolvedValueOnce(undefined);
            await agent.get("/budget").expect(401, "Not logged in");
        });

        test("Unsuccessfully get budget rows if user is not logged in", async () => {
            await agent.post("/user/logout").expect(200);
            await agent.get("/budget").expect(401, "Not logged in");
        });

        test("Handle internal server error gracefully", async () => {
            jest.spyOn(budgetRowService, "getBudgetRows").mockRejectedValue(new Error("Database error"));
            await agent.get("/budget").expect(500, "Database error");
        });
    });

    describe("POST /budget", () => {
        test("Successfully add a budget row", async () => {
            await agent.post("/budget").send({ category: "Groceries", amount: 1000 }).expect(201);
        });

        test("Unsuccessfully add a budget row if user is not logged in", async () => {
            await agent.post("/user/logout").expect(200);
            await agent.post("/budget").send({ category: "Groceries", amount: 1000 }).expect(401);
        });

        test("Unsuccessfully add a budget row with invalid category", async () => {
            await agent.post("/budget").send({ category: 1, amount: 1000 }).expect(400);
        });

        test("Unsuccessfully add a budget row with invalid amount", async () => {
            await agent.post("/budget").send({ category: "Groceries", amount: "1000" }).expect(400);
        });

        test("Handles internal server error", async () => {
            jest.spyOn(budgetRowService, "addBudgetRow").mockRejectedValue(new Error("Database error"));
            await agent.post("/budget").send({ category: "Groceries", amount: 1000 }).expect(500, "Database error");
        });
    });

    describe("DELETE /budget", () => {
        test("Successfully deletes a budget row", async () => {
            const addResponse = await agent.post("/budget").send({ category: "Groceries", amount: 1000 })
            await agent.delete("/budget").send({ id: addResponse.body.id }).expect(200);
        });

        test("Unsuccessfully delete a budget row with invalid id", async () => {
            await agent.delete("/budget").send({ id: "1" }).expect(400);
        });

        test("Unsuccessfully delete a budget row if user is not logged in", async () => {
            await agent.post("/user/logout").expect(200);
            await agent.delete("/budget").send({ id: 1 }).expect(401);
        });

        test("Unsuccessfully delete a non-existent budget row", async () => {
            await agent.delete("/budget").send({ id: 999 }).expect(404);
        });

        test("Handle internal server error gracefully", async () => {
            jest.spyOn(budgetRowService, "deleteBudgetRow").mockRejectedValue(new Error("Database error"));
            await agent.delete("/budget").send({ id: 1 }).expect(500, "Database error");
        });
    });
});
