import {  Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./userValidation";
import { validateRequest } from "../../middlewares/validateRequest";
import { verifyToken } from "../../utils/jwt";


const router = Router()



router.post("/register",validateRequest(createUserZodSchema), UserControllers.createUser)

router.get("/all-users", verifyToken(role.ADMIN),  UserControllers.getAllUsers)




export const UserRoutes = router


