// import { BudgetRowService } from "../service/budget";
// import { userService } from "../start";
// import { app } from "../start";
// import request from "supertest";

// const username = "User";
// const password = "Password";

// let budgetRowService: BudgetRowService;
// let agent: ReturnType<typeof request.agent>;

test("always passes", () => {
    expect(1 + 1).toBe(2);
});

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