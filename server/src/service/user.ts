import { User } from "../model/user.interface";
import { UserModel } from "../db/user.db";
import { IUserService } from "./interface/IUserService";
import bcrypt from "bcrypt";

export class UserService implements IUserService {

    /**
     * Creates a UserModel object to be returned and added to the database.
     * 
     * @param username - Username for new user
     * @param password - Password for new user
     * @returns - Creates UserModel object or returns 'undefined' 
     * if the username is taken or invalid credentials are provided
     * 
     */
    async createUser(username: string, password: string): Promise<UserModel | undefined> {
        if (!username || !password) {
            return undefined;
        }

        if (await UserModel.findOne({ where: { username } })) {
            console.error("User already exists");
            return undefined;
        }

        const salt: string = bcrypt.genSaltSync(10);
        const hashedPassword: string = bcrypt.hashSync(password, salt);

        return await UserModel.create({
            username: username,
            password: hashedPassword,
        });
    }

    /**
     * Finds a user by username, and optionally verifies password. 
     * 
     * @param username - Username of the user to find
     * @param password - Password to verify (Optional) 
     * @returns - An existing user, otherwise 'undefined' if user does not exist
     * or provided password is incorrect. 
     */

    async findUser(username: string, password?: string): Promise<User | undefined> {
        const user: User | null = await UserModel.findOne({ where: { username }, include: "budgetRows" });

        if (!user) {
            console.warn(`User not found: ${username}`);
            return undefined;
        }

        if (!password) {
            return user;
        }

        if (bcrypt.compareSync(password, user.password)) {
            return user;
        }

        console.warn(`Incorrect password for user: ${username}`);
        return undefined;
    }

}