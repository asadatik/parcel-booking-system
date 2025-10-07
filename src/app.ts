/* eslint-disable no-constant-binary-expression */

/* eslint-disable @typescript-eslint/no-unused-vars */
import express, {  NextFunction, Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalerrorhandler";
import notFound from "./app/middlewares/notfoundroute";
import cookieParser from "cookie-parser";



const app  = express();



app.use(cookieParser());

app.set("trust proxy", 1); // trust first proxy
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//

app.use( cors({
    origin: ["https://percel-frontend.vercel.app", "http://localhost:5173"], 
    credentials: true, // cookie/auth header 
  })
);




app.use("/api/v1/", router)

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to library App");
});


// global error handler

app.use(globalErrorHandler)

// handle not found route   
app.use(notFound)

export default app;
