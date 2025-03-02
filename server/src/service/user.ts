import { User } from "../model/user.interface";
import bcrypt from "bcrypt";

export class UserService {
    users: User[] = [];

    async createUser(username: string, password: string) {
        const salt = bcrypt.genSaltSync(10);
        const user: User = ({
            username: username,
            password: bcrypt.hashSync(password, salt),
            budgets: [],
            expenses: []
        });

        this.users.push(user);
        // console.log("Users after creation:", this.users);
        return user;
    }

    async findUser(username: string, password?: string): Promise<User | undefined> {
        const user = this.users.find((user) => user.username === username);
        // console.log("Users at findUser:", this.users);
        if (!user) {
            // console.log("Returns here");
            return undefined;
        } 
    
        if (!password) {
            return user;
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
        
        return isMatch ? user : undefined; 
    }

}