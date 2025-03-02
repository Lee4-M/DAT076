import express, { Request, Response, Router } from "express";
import { UserService } from "../service/user";
import { User } from "../model/user.interface";

export function userRouter(userService: UserService): Router {
    const userRouter = express.Router();

    interface UserRequest extends Request {
        body: { username: string, password: string },
        session: any
    }

    userRouter.post("/user", async (req: UserRequest, res: Response) => {
        try {
            await userService.createUser(req.body.username, req.body.password);
            res.status(201).send("User registered sucessfully as: " + req.body.username);
        } catch (error: any) {
            res.status(400).send("Failed to register user: " + error.message);
        }
    });

    userRouter.post("/user/login", async (req: UserRequest, res: Response) => {
        const user: User | undefined = await userService.findUser(req.body.username, req.body.password);
        //console.log("Session after login:", req.session);
        if (!user) {
            res.status(401).send("No such username or password");
            //console.log("aaa");
            return;
        }
        req.session.username = req.body.username;
        res.status(200).send("Logged in as: " + req.body.username);
    });

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