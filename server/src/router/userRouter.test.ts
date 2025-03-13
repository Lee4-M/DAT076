import request from "supertest";
import express from "express";
import session from "express-session";
import { UserService } from "../service/user";
import { userRouter } from "./user";

let app: express.Application;
let userService: UserService;
let agent: ReturnType<typeof request.agent>;

const username = "User";
const password = "Password";

beforeAll(async () => {
    userService = new UserService();
    app = express();
    app.use(express.json());
    app.use(
        session({
            secret: "test_secret",
            resave: false,
            saveUninitialized: true,
        })
    );
    app.use(userRouter(userService));
});

beforeEach(async () => {
    agent = request.agent(app);
});

describe("User API Tests", () => {
    describe("POST /user", () => {
        test("Successfully register a user", async () => {
            const response = await agent.post("/user").send({ username, password }).expect(201);
            expect(response.text).toEqual("User registered successfully as: " + username);
        });

        test("Fail to register a user with bad input", async () => {
            const response = await agent.post("/user").send({ username: 1, password: 1 }).expect(400);
            expect(response.text).toEqual("Bad POST call to /user --- username has type number or password has type number");
        });

        test("Fail to register a user that already exists", async () => {
            await agent.post("/user").send({ username, password }).expect(201);
            const response = await agent.post("/user").send({ username, password }).expect(500);
            expect(response.text).toEqual("Failed to register user: User already exists");
        });

        test("Handle internal server error gracefully", async () => {
            const spy = jest.spyOn(userService, "createUser").mockImplementation(() => {
                throw new Error("Internal server error");
            });
            const response = await agent.post("/user").send({ username, password }).expect(500);
            expect(response.text).toEqual("Failed to register user: Internal server error");
            spy.mockRestore();
        });
    });

    describe("POST /user/login", () => {
        test("Successfully login a user", async () => {
            await agent.post("/user").send({ username, password }).expect(201);
            const response = await agent.post("/user/login").send({ username, password }).expect(200);
            expect(response.text).toEqual("Logged in as: " + username);
        });

        test("Fail to login a user with bad input", async () => {
            const response = await agent.post("/user/login").send({ username: 1, password: 1 }).expect(400);
            expect(response.text).toEqual("Bad POST call to /user/login --- username has type number or password has type number");
        });

        test("Fail to login a user that does not exist", async () => {
            const response = await agent.post("/user/login").send({ username, password }).expect(401);
            expect(response.text).toEqual("No such username or password");
        });

        test("Fail to login a user that is already logged in", async () => {
            await agent.post("/user").send({ username, password }).expect(201);
            await agent.post("/user/login").send({ username, password }).expect(200);
            const response = await agent.post("/user/login").send({ username, password }).expect(400);
            expect(response.text).toEqual("Already logged in");
        });

        test("Handle internal server error gracefully", async () => {
            const spy = jest.spyOn(userService, "findUser").mockRejectedValue(new Error("Internal server error"));
            const response = await agent.post("/user/login").send({ username, password }).expect(500);
            expect(response.text).toEqual("Failed to login: Internal server error");
            spy.mockRestore();
        });
    });

    describe("POST /user/logout", () => {
        test("Successfully logout a user", async () => {
            await agent.post("/user").send({ username, password }).expect(201);
            await agent.post("/user/login").send({ username, password }).expect(200);
            const response = await agent.post("/user/logout").expect(200);
            expect(response.text).toEqual("Logged out successfully");
        });

        test("Fail to logout a user that is not logged in", async () => {
            const response = await agent.post("/user/logout").expect(401);
            expect(response.text).toEqual("Not logged in");
        });
    });
});