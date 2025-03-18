import express, { Request, Response, Router } from "express";
import { User } from "../model/user.interface";
import { IUserService } from "../service/interface/IUserService";

export function userRouter(userService: IUserService): Router {
    const userRouter = express.Router();

    interface UserRequest extends Request {
        body: { username: string, password: string },
        session: any
    }

    /**
     * POST /user: Adds a new user.
     * 
     * @param req - The request object: contains the username and password in the body.
     * @param res - The response object: registered user or an error message
     * 
     * @returns 201 - Returns a success message if the user is registered successfully.
     * @returns 400 - Returns an error message if the username or password is invalid, or if the user already exists.
     * @returns 500 - Returns an error message if there is a server error.
     * 
    */

    userRouter.post("/user", async (req: UserRequest, res: Response) => {
        try {
            const { username, password } = req.body;
            if ((typeof (username) !== "string") || (typeof (password) !== "string")) {
                res.status(400).send(`Bad POST call to ${req.originalUrl} --- username has type ${typeof (username)} or password has type ${typeof (password)}`);
                return;
            }
            if (await userService.findUser(username)) {
                res.status(400).send("Failed to register user: User already exists");
                return;
            }
            await userService.createUser(req.body.username, req.body.password);
            res.status(201).send("User registered successfully as: " + req.body.username);
        } catch (error: any) {
            res.status(500).send("Failed to register user: " + error.message);
        }
    });

    /**
     * POST /user/login: Logs in a user.
     * 
     * @param req - The request object: contains the username and password in the body.
     * @param res - The response object: user session or an error message.
     * 
     * @returns 200 - Returns a success message if the user is logged in successfully.
     * @returns 400 - Returns an error message if the user is already logged in or if the username or password is invalid.
     * @returns 401 - Returns an error message if the username or password is incorrect.
     * @returns 500 - Returns an error message if there is a server error.
     * 
     */

    userRouter.post("/user/login", async (req: UserRequest, res: Response) => {
        try {
            if (req.session.username) {
                res.status(400).send("Already logged in");
                return;
            }
            const { username, password } = req.body;
            if ((typeof (username) !== "string") || (typeof (password) !== "string")) {
                res.status(400).send(`Bad POST call to ${req.originalUrl} --- username has type ${typeof (username)} or password has type ${typeof (password)}`);
                return;
            }
            const user: User | undefined = await userService.findUser(username, password);
            if (!user) {
                res.status(401).send("No such username or password");
                return;
            }
            req.session.username = req.body.username;
            res.status(200).send("Logged in as: " + req.body.username);
        } catch (error: any) {
            res.status(500).send("Failed to login: " + error.message);
        }
    });

    /**
     * POST /user/logout: Logs out a user.
     * 
     * @param req - The request object containing the session information.
     * @param res - The response object: messege of successful logout or error message. 
     * 
     * @returns 200 - Returns a success message if the user is logged out successfully.
     * @returns 401 - Returns an error message if the user is not logged in.
     * 
     */

    userRouter.post("/user/logout", (req: UserRequest, res: Response) => {
        if (!req.session.username) {
            res.status(401).send("Not logged in");
            return;
        }
        delete req.session.username;
        res.status(200).send("Logged out successfully");
    });

    return userRouter;
}