
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, {  NextFunction, Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalerrorhandler";
import notFound from "./app/middlewares/notfoundroute";
import cookieParser from "cookie-parser";


const app  = express();



app.set('trust proxy', 1);
app.use(cookieParser());
app.use(cors())
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

