import { UserService } from "./user";

let userSerivce: UserService;

beforeAll(() => {
    userSerivce = new UserService();
});

describe("UserService", () => {
    describe("Create a user", () => {
        test("Creating a user should return not undefined", async () => {
            const user = await userSerivce.createUser("User", "Password");
            expect(user).not.toBeUndefined();
        });

        test("Create a user with empty values should return undefined", async () => {
            const user = await userSerivce.createUser("", "");
            expect(user).toBeUndefined();
        });

        test("Create a user with existing username should return undefined", async () => {
            await userSerivce.createUser("User", "Password");
            const user = await userSerivce.createUser("User", "Password");
            expect(user).toBeUndefined();
        });
    });

    describe("Find a user", () => {
        test("Finding a user by username and password should not return undefined", async () => {
            await userSerivce.createUser("User", "Password");
            const foundUser = await userSerivce.findUser("User", "Password");
            expect(foundUser).not.toBeUndefined();
        });

        test("Find a user by username with wrong password should return undefined", async () => {
            await userSerivce.createUser("User", "Password");
            const foundUser = await userSerivce.findUser("User", "WrongPassword");
            expect(foundUser).toBeUndefined();
        });

        test("Find a user by username only should not return undefined", async () => {
            await userSerivce.createUser("User", "Password");
            const foundUser = await userSerivce.findUser("User");
            expect(foundUser).not.toBeUndefined();
        });

        test("Find a user by non-existent username should return undefined", async () => {
            const foundUser = await userSerivce.findUser("NonExistentUser");
            expect(foundUser).toBeUndefined();
        });
    });
});