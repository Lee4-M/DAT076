import { User } from '../model/user.interface';
import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'crypto';
import { v4 as uuidv4 } from "uuid";

const users: User[] = []; // TODO: Replace with a real DB

export class AuthService {

    // Register a new user
    static async register(username: string, password: string) {
        const salt = randomBytes(128).toString('base64');
        const hash = pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');

        const newUser: User = {
            id: uuidv4(),
            username,
            salt,  
            password: hash,
        };

        users.push(newUser); // TODO: replace with DB also make sure to check if user already exists
        return { id: newUser.id, username: newUser.username };
    }

    // Log in user
    static async login(username: string, password: string, session: any) {
        const user = users.find((u) => u.username === username);
        if (!user) throw new Error("User not found");

        const hashedAttempt = pbkdf2Sync(password, user.salt, 10000, 512, 'sha512');
        const storedHashBuffer = Buffer.from(user.password, 'hex');

        if (hashedAttempt.length !== storedHashBuffer.length || !timingSafeEqual(hashedAttempt, storedHashBuffer)) {
            throw new Error("Invalid password");
        }

        session.user = { id: user.id, username: user.username };
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
