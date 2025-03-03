import { User } from "../model/user.interface";
import { UserModel } from "../db/user.db";
import bcrypt from "bcrypt";

export class UserService {
    async createUser(username: string, password: string): Promise<UserModel | null> {

        if (await UserModel.findOne({where: {username}})) {
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
        if (! password) {
            return await UserModel.findOne({ where: { username }});
        }

        const user : User | null = await UserModel.findOne({ where: {username}, include: "tasks"});

        if (!user) return null;

        if (bcrypt.compareSync(password, user.password)) {
            return user;
        }

        return null;
    }

}