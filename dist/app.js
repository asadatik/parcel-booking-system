"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./app/routes");
const globalerrorhandler_1 = require("./app/middlewares/globalerrorhandler");
const notfoundroute_1 = __importDefault(require("./app/middlewares/notfoundroute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/", routes_1.router);
app.get("/", (req, res) => {
    res.send("Welcome to library App");
});
// global error handler
app.use(globalerrorhandler_1.globalErrorHandler);
// handle not found route   
app.use(notfoundroute_1.default);
exports.default = app;
