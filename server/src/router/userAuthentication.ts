import express, { Request, Response, Router } from "express";
import { AuthService } from "../service/auth";
import { User } from "../model/user.interface";


export function authRouter(authService: AuthService): Router{
    const authRouter = express.Router();
    interface UserRequest extends Request {
        body: { username: string, password: string},
        session: any
    }

    authRouter.post("/register", async (req: UserRequest, res: Response) => {
        try {
            authService.register(req.body.username, req.body.password)

            res.status(201).json({username: req.body.username});
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    });



/*     authRouter.post("/login", async (req: UserRequest, res: Response) => {
        try {
            const user = await authService.login(req.body.username, req.body.password, req.session);
            req.session.user = user; // Store user properly
            res.status(200).json(user);
        } catch (error) {
            res.status(401).json({ error: (error as Error).message });
        }
    }); */
    
/*      authRouter.post("/login", async (req: UserRequest, res: Response) => { // TODO: ADD CASE OF EXISTING USER? 
          req.session.username = req.body.username;
          res.status(200).send("Logged in as: " + req.session.username);
     }); */


     //login mockup adjustet from express-session website
     authRouter.post("/login", async (req: UserRequest, res: Response, next) => { 
        try {
            const user = await authService.login(req.body.username, req.body.password, req.session);
            
            req.session.regenerate((err: Error | null) => { 
                if (err) return next(err);
    
                req.session.user = user; 
                
                req.session.save((err: Error | null) => { 
                    if (err) return next(err);
                    res.status(200).json({ message: "Logged in successfully", user });
                });
            });
        } catch (error) {
            res.status(401).json({ error: (error as Error).message });
        }
    });
    
    authRouter.post("/logout", (req, res) => {
        AuthService.logout(req.session);
        res.status(200).json({ message: "Logged out" });
    });

    authRouter.get("/session", (req, res) => {
        const user = AuthService.getSessionUser(req.session);
        res.status(200).json({ user });
    });


    return authRouter

}

/* 

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = await AuthService.register(username, password);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        if (!req.session) throw new Error("Session not initialized");
        const { username, password } = req.body;
        const user = await AuthService.login(username, password, req.session);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ error: error instanceof Error ? error.message : "Unknown login error" });
    }
});


authRouter.post("/logout", (req, res) => {
    AuthService.logout(req.session);
    res.status(200).json({ message: "Logged out" });
});

authRouter.get("/session", (req, res) => {
    const user = AuthService.getSessionUser(req.session);
    res.status(200).json({ user });
});
 */