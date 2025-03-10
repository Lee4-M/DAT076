// import { BudgetRowService } from "../service/budget";
// import { userService } from "../start";
// import { app } from "../start";
// import request from "supertest";

// const username = "User";
// const password = "Password";

// let budgetRowService: BudgetRowService;
// let agent: ReturnType<typeof request.agent>;

// beforeAll(async () => {
//     budgetRowService = new BudgetRowService(userService);
//     await userService.createUser(username, password);
// });

// beforeEach(async () => {
//     // await budgetRowService.resetBudgets(username);
//     // eslint-disable-next-line @typescript-eslint/no-misused-promises
//     agent = request.agent(app);
//     await agent
//         .post("/user/login")
//         .send({ username, password })
//         .expect(200);
// });

// describe("Delete Budget", () => {
//     test("Budget deleted successfully", async () => {
//         const category = "Groceries";
//         const cost = 1000;

//         await budgetRowService.addBudgetRow(username, category, cost);

//         await agent
//             .delete("/budget")
//             .send({ category: "Groceries" })
//             .expect(200);
//     });

//     test("Wrong budget item attempted to be deleted", async () => {
//         const category = "Groceries";
//         const cost = 1000;

//         await budgetRowService.addBudgetRow(username, category, cost);

//         await agent
//             .delete("/budget")
//             .send({ category: "not-existing" })
//             .expect(404);
//     })

// });

import request from "supertest";
import express from "express";
import session from "express-session";
import { BudgetRowService } from "../service/budget";
import { budgetRowRouter } from "./budget";
import { UserService } from "../service/user";

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
});

beforeEach(async () => {
    agent = request.agent(app);
    await agent.post("/user").send({ username, password }).expect(201);
    await agent.post("/user/login").send({ username, password }).expect(200);
});

describe("BudgetRow API Tests", () => {
    test("Successfully adds and deletes a budget row", async () => {
        const category = "Groceries";
        const cost = 1000;

        // Add a budget row
        const addResponse = await agent.post("/budget").send({ category, cost }).expect(201);
        const budgetRowId = addResponse.body.id;

        // Ensure deletion works
        await agent.delete("/budget").send({ id: budgetRowId }).expect(200);
    });

    test("Fails to delete a non-existent budget row", async () => {
        await agent.delete("/budget").send({ id: 9999 }).expect(404);
    });

    test("Fetch empty budget rows for user", async () => {
        const response = await agent.get("/budget").expect(200);
        expect(response.body).toEqual([]);
    });
});
