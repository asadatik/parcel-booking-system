import {  Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./userValidation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";


const router = Router()


//
router.post("/register",validateRequest(createUserZodSchema), UserControllers.createUser)
//
router.get("/all-user", checkAuth(Role.ADMIN), UserControllers.getAllUsers)
//
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe)
//
router.get("/:id", checkAuth(Role.ADMIN), UserControllers.getSingleUser)
//
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserControllers.updateUser)

export const UserRoutes = router


