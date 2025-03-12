import { User } from "../model/user.interface";
import { UserModel } from "../db/user.db";
import bcrypt from "bcrypt";
import { IUserService } from "./IUserService";

export class UserService implements IUserService {
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