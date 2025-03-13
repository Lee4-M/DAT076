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

const username = "User";
const password = "Password";

beforeAll(async () => {
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
    await agent.post("/user").send({ username, password }).expect(201);
    await agent.post("/user/login").send({ username, password }).expect(200);
});

describe("BudgetRow API Tests", () => {
    describe("GET /budget", () => {
        test("Successfully get a list of budget rows", async () => {
            const category = "Groceries";
            const amount = 1000;

            await agent.post("/budget").send({ category, amount }).expect(201);

            const response = await agent.get("/budget").expect(200);
            expect(response.body).toEqual([
                { category: category, amount: amount, id: 1, userId: 1 },
            ]);
        });

        test("Successfully get empty budget rows for user", async () => {
            const response = await agent.get("/budget").expect(200);
            expect(response.body).toEqual([]);
        });

        test("Unsuccesfully get budget rows if user no longer exists", async () => {
            jest.spyOn(userService, "findUser").mockResolvedValueOnce(undefined);

            const response = await agent.get("/budget").expect(401);
            expect(response.text).toEqual("Not logged in");
        });

        test("Unsuccessfully get budget rows if user is not logged in", async () => {
            await agent.post("/user/logout").expect(200);
            await agent.get("/budget").expect(401);
        });

        test("Handle internal server error gracefully", async () => {
            jest.spyOn(budgetRowService, "getBudgetRows").mockRejectedValue(new Error("Database error"));

            const response = await agent.get("/budget").expect(500);

            expect(response.text).toBe("Database error");

            (budgetRowService.getBudgetRows as jest.Mock).mockRestore();
        });
    });

    describe("POST /budget", () => {
        test("Successfully add a budget row", async () => {
            const category = "Groceries";
            const amount = 1000;

            await agent.post("/budget").send({ category, amount }).expect(201);
        });

        test("Unsuccessfully add a budget row if user is not logged in", async () => {
            await agent.post("/user/logout").expect(200);
            const category = "Groceries";
            const amount = 1000;

            await agent.post("/budget").send({ category, amount }).expect(401);
        });

        test("Unsuccessfully add a budget row with invalid category", async () => {
            const category = 1;
            const amount = 1000;

            await agent.post("/budget").send({ category, amount }).expect(400);
        });

        test("Unsuccessfully add a budget row with invalid amount", async () => {
            const category = "Groceries";
            const amount = "1000";

            await agent.post("/budget").send({ category, amount }).expect(400);
        });

        test("Handle internal server error gracefully", async () => {
            const category = "Groceries";
            const amount = 1000;
            jest.spyOn(budgetRowService, "addBudgetRow").mockRejectedValue(new Error("Database error"));

            const response = await agent.post("/budget").send({ category, amount }).expect(500);

            expect(response.text).toBe("Database error");

            (budgetRowService.addBudgetRow as jest.Mock).mockRestore();
        });
    });

    describe("DELETE /budget", () => {
        test("Successfully deletes a budget row", async () => {
            const category = "Groceries";
            const amount = 1000;

            const addResponse = await agent.post("/budget").send({ category, amount })
            const id = addResponse.body.id;

            await agent.delete("/budget").send({ id }).expect(200);
        });

        test("Unsuccessfully delete a budget row with invalid id", async () => {
            const id = "1";
            await agent.delete("/budget").send({ id }).expect(400);
        });

        test("Unsuccessfully delete a budget row if user is not logged in", async () => {
            await agent.post("/user/logout").expect(200);
            const id = 1;

            await agent.delete("/budget").send({ id }).expect(401);
        });

        test("Unsuccessfully delete a non-existent budget row", async () => {
            const id = 1;
            await agent.delete("/budget").send({ id }).expect(404);
        });

        test("Handle internal server error gracefully", async () => {
            const id = 1;
            jest.spyOn(budgetRowService, "deleteBudgetRow").mockRejectedValue(new Error("Database error"));

            const response = await agent.delete("/budget").send({ id: id }).expect(500);

            expect(response.text).toBe("Database error");

            (budgetRowService.deleteBudgetRow as jest.Mock).mockRestore();
        });
    });
});
