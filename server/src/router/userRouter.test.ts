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

beforeAll(() => {
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

beforeEach(() => {
    agent = request.agent(app);
});

afterEach(() => {
    jest.restoreAllMocks(); 
});

describe("User API Tests", () => {
    describe("POST /user", () => {
        test("Successfully register a user", async () => {
            await agent.post("/user").send({ username, password }).expect(201, "User registered successfully as: " + username);
        });

        test("Fail to register a user with bad input", async () => {
            await agent.post("/user").send({ username: 1, password: 1 }).expect(400, 
                "Bad POST call to /user --- username has type number or password has type number");
        });

        test("Fail to register a user that already exists", async () => {
            await agent.post("/user").send({ username, password }).expect(201);
            await agent.post("/user").send({ username, password }).expect(500, "Failed to register user: User already exists");
        });

        test("Handle internal server error gracefully", async () => {
            jest.spyOn(userService, "createUser").mockRejectedValue(new Error("Internal server error"));
            await agent.post("/user").send({ username, password }).expect(500, "Failed to register user: Internal server error");
        });
    });

    describe("POST /user/login", () => {
        test("Successfully login a user", async () => {
            await agent.post("/user").send({ username, password }).expect(201);
            await agent.post("/user/login").send({ username, password }).expect(200, "Logged in as: " + username);
        });

        test("Fail to login a user with bad input", async () => {
            await agent.post("/user/login").send({ username: 1, password: 1 }).expect(400,
                "Bad POST call to /user/login --- username has type number or password has type number");
        });

        test("Fail to login a user that does not exist", async () => {
            await agent.post("/user/login").send({ username, password }).expect(401, "No such username or password");
        });

        test("Fail to login a user that is already logged in", async () => {
            await agent.post("/user").send({ username, password }).expect(201);
            await agent.post("/user/login").send({ username, password }).expect(200);
            await agent.post("/user/login").send({ username, password }).expect(400, "Already logged in");
        });

        test("Handle internal server error gracefully", async () => {
            jest.spyOn(userService, "findUser").mockRejectedValue(new Error("Internal server error"));
            await agent.post("/user/login").send({ username, password }).expect(500, "Failed to login: Internal server error");
        });
    });

    describe("POST /user/logout", () => {
        test("Successfully logout a user", async () => {
            await agent.post("/user").send({ username, password }).expect(201);
            await agent.post("/user/login").send({ username, password }).expect(200);
            await agent.post("/user/logout").expect(200, "Logged out successfully");
        });

        test("Fail to logout a user that is not logged in", async () => {
            await agent.post("/user/logout").expect(401, "Not logged in");
        });
    });
});