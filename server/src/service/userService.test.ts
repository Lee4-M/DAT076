import { UserService } from "./user";

let userSerivce: UserService;

beforeAll(() => {
    userSerivce = new UserService();
});

describe("UserService", () => {
    describe("Create a user", () => {
        test("Creating a user should return not null", async () => {
            const user = await userSerivce.createUser("User", "Password");
            expect(user).not.toBeNull();
        });

        test("Create a user with empty values should return null", async () => {
            const user = await userSerivce.createUser("", "");
            expect(user).toBeNull();
        });

        test("Create a user with existing username should return null", async () => {
            await userSerivce.createUser("User", "Password");
            const user = await userSerivce.createUser("User", "Password");
            expect(user).toBeNull();
        });
    });

    describe("Find a user", () => {
        test("Finding a user by username and password should not return null", async () => {
            await userSerivce.createUser("User", "Password");
            const foundUser = await userSerivce.findUser("User", "Password");
            expect(foundUser).not.toBeNull();
        });

        test("Find a user by username with wrong password should return null", async () => {
            await userSerivce.createUser("User", "Password");
            const foundUser = await userSerivce.findUser("User", "WrongPassword");
            expect(foundUser).toBeNull();
        });

        test("Find a user by username only should not return null", async () => {
            await userSerivce.createUser("User", "Password");
            const foundUser = await userSerivce.findUser("User");
            expect(foundUser).not.toBeNull();
        });

        test("Find a user by non-existent username should return null", async () => {
            const foundUser = await userSerivce.findUser("NonExistentUser");
            expect(foundUser).toBeNull();
        });
    });
});