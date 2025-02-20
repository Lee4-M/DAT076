import { User } from '../model/user.interface';
import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'crypto';
import bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync(10); 


export class AuthService {

    users: User[] = []; // TODO: Replace with a real DB
    

    // Register a new user
    async register(username: string, password: string) {
        const hash = await bcrypt.hash(password, salt);

        if (this.users.some((u) => u.username === username)) {
            throw new Error("Username already taken");
        }
        const newUser: User = { username, password: hash };
        this.users.push(newUser); // TODO: replace with DB also make sure to check if user already exists
        return { username: newUser.username };
    }

    // Log in user
    async login(username: string, password: string, session: any) {
        const user = this.users.find((u) => u.username == username);
        if (!user) throw new Error("User not found");
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid password");
        
        session.user = { username: user.username};
        return session.user;
    }

    // Logout a user
    static logout(session: any) {
        session.destroy(() => { });

        return { message: "Logged out successfully" };
    }

    // Get current session user
    static getSessionUser(session: any) {
        return session.user || null;
    }
}
