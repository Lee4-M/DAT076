import * as SuperTest from "supertest";
import { app } from "./start";
import { Budget } from "./model/budget.interface";
import { Expense } from "./model/expense.interface";


const request = SuperTest.default(app);

test("End-to-end test", async() => {
    const category= "Rent"
    const cost = 4000

    //Creating budget
    const res1 = await request.post("/budget").send({category, cost});
    expect(res1.statusCode).toEqual(201);
    expect(res1.body.category).toEqual(category);
    expect(res1.body.cost).toEqual(cost);

    //Verify budget
    const res2 = await request.get("/budget");
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.some((budget: Budget) => budget.category === category && budget.cost === cost)).toBeTruthy();

    

})