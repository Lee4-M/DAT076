import { User } from "../model/user.interface";
import { UserModel } from "../db/user.db";
import bcrypt from "bcrypt";
import { IUserService } from "./interface/IUserService";

export class UserService implements IUserService {
    async createUser(username: string, password: string): Promise<UserModel | null> {
        if (!username || !password) {
            return null;
        }

        if (await UserModel.findOne({ where: { username } })) {
            return null;
        }

        const salt: string = bcrypt.genSaltSync(10);
        const hashedPassword: string = bcrypt.hashSync(password, salt);

        return await UserModel.create({
            username: username,
            password: hashedPassword,
        });
    }

    async findUser(username: string, password?: string): Promise<User | null> {
        const user: User | null = await UserModel.findOne({ where: { username }, include: "budgetRows" });

        if (!user) {
            console.warn(`User not found: ${username}`);
            return null;
        }

        if (!password) {
            return user;
        }

        if (bcrypt.compareSync(password, user.password)) {
            return user;
        }

        console.warn(`Incorrect password for user: ${username}`);
        return null;
    }

}