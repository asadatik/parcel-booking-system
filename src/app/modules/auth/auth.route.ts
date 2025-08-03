import {  NextFunction, Request, Response, Router } from "express";

import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";

import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router()

router.post("/login", AuthControllers.credentialsLogin)
router.post("/refresh-token", AuthControllers.getNewAccestoken)
router.post("/logout", AuthControllers.logOutUser)
router.post("/change-password", checkAuth(...Object.values(Role)) , AuthControllers.changePassword) // Assuming this is a placeholder for future implementation

router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"  
     passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})


// api/v1/auth/google/callback?state=/booking
router.get("/google/callback", passport.authenticate("google",    passport.authenticate("google", { failureRedirect: "/login" }),    AuthControllers.googleCallbackController) )








export const AuthRoutes = router;