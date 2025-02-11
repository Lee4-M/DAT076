import * as SuperTest from "supertest";
import { app } from "./start";
import { Budget } from "./model/budget.interface";
import { Expense } from "./model/expense.interface";


const request = SuperTest.default(app);

test("End-to-end test", async() => {
    const category= "Rent";
    const cost = 4000;
    const expenseCost = 3000;
    const desc = "house"

    //Creating budget
    const res1 = await request.post("/budget").send({category, cost});
    expect(res1.statusCode).toEqual(201);
    expect(res1.body.category).toEqual(category);
    expect(res1.body.cost).toEqual(cost);

    //Create expense
    const res2 = await request.post("/expense").send({ category, cost: expenseCost, description: desc});
    expect(res2.statusCode).toEqual(201);
    expect(res2.body.category).toEqual(category);
    expect(res2.body.cost).toEqual(expenseCost);
    expect(res2.body.description).toEqual(desc);

    const expenseId = res2.body.id;

    //Verify budget 
    const rest3 = await request.get("/budget");
    expect(rest3.statusCode).toEqual(200);
    expect(rest3.body.some((budget: Budget) => budget.category === category && budget.result === (cost - expenseCost))).toBeTruthy();

})