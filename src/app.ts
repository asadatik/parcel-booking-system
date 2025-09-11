
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, {  NextFunction, Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalerrorhandler";
import notFound from "./app/middlewares/notfoundroute";
import cookieParser from "cookie-parser";

import expressSession from "express-session";


const app  = express();

app.use(expressSession(
    {
        secret: "secret",
        resave: false,
        saveUninitialized: true, }

))


app.use(cookieParser());

//

app.use( cors({
    origin: "http://localhost:5173", // frontend url explicitly দিতে হবে
    credentials: true, // cookie/auth header পাঠানোর জন্য
  })   )

app.use(express.json())


app.use("/api/v1/", router)

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to library App");
});


// global error handler

app.use(globalErrorHandler)

// handle not found route   
app.use(notFound)

export default app;
