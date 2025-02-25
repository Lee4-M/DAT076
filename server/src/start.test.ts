import * as SuperTest from "supertest";
import { app } from "./start";
import { Budget } from "./model/budget.interface";

const request = SuperTest.default(app);

const category= "Rent";
const cost = 4000;
const expenseCost = 3000;
const desc = "house"

test("create a budget", async () => {
    const res = await request.post("/budget").send({ category, cost });
    expect(res.statusCode).toEqual(201);
    expect(res.body.category).toEqual(category);
    expect(res.body.cost).toEqual(cost);
});

test("create an expense", async () => {
    const res = await request.post("/expense").send({ category, cost: expenseCost, description: desc });
    expect(res.statusCode).toEqual(201);
    expect(res.body.category).toEqual(category);
    expect(res.body.cost).toEqual(expenseCost);
    expect(res.body.description).toEqual(desc);
});

test("verify budget after expense", async () => {
    const res = await request.get("/budget");
    expect(res.statusCode).toEqual(200);
    expect(res.body.some((budget: Budget) => budget.category === category && budget.result === (cost - expenseCost))).toBeTruthy();
});
