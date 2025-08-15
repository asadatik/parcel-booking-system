"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const auth_controller_1 = require("./auth.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.AuthControllers.credentialsLogin);
router.post("/refresh-token", auth_controller_1.AuthControllers.getNewAccestoken);
router.post("/logout", auth_controller_1.AuthControllers.logOutUser);
router.post("/change-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.AuthControllers.changePassword); // Assuming this is a placeholder for future implementation
exports.AuthRoutes = router;
