/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";

import httpStatus from 'http-status-codes';
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../errorHelper/appError";
import { createUserTokens } from "../../utils/userTokens";
import { setAuthCookie } from "../../utils/setCookie";
import { envVars } from "../../config/env";


const createUser = async (req: Request, res: Response  , next : NextFunction) => {
  try {
   
   
    const user = await UserServices.createUser(req.body)

    res.status(httpStatus.CREATED).json({
      message: "User Created Successfully",
      user
    })
  }
   


  
 catch (err: any) {
     console.log(
        "🚀 ~ file: user.controller.ts ~ line 15 ~ createUser ~ error",
        next(err)
     )
       
}

}
// get all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await UserServices.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users fetched successfully",
    data: users.data,
    meta: users.meta
  });
});


export const UserControllers = {
  createUser,
  getAllUsers

}
