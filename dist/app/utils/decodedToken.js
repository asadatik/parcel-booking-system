"use strict";
/* eslint-disable no-console */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodedToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = __importDefault(require("../errorHelper/appError"));
const env_1 = require("../config/env");
const decodedToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.envVars.JWT_ACCESS_SECRET);
        return {
            userId: decoded.id,
            role: decoded.role,
            email: decoded.email,
        };
    }
    catch (error) {
        console.error("Token verification failed:", error);
        throw new appError_1.default(401, "Invalid or expired token");
    }
};
exports.decodedToken = decodedToken;
