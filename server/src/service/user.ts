import { User } from "../model/user.interface";

export class UserService {
    users: User[] = [];

    async createUser(username: string, password: string) {
        this.users.push({
            username: username,
            password: password,
            budgets: [],
            expenses: []
        });
    }

    async findUser(username: string, password?: string): Promise<User | undefined> {
        if (!password) {
            return this.users.find((user) => user.username === username);
        }
        console.log(this.users);
        return this.users.find((user) => user.username === username && user.password === password);
    }

}