/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"

import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from "./auth.service"
import AppError from "../../errorHelper/appError"
import { setAuthCookie } from "../../utils/setCookie"
import { JwtPayload } from "jsonwebtoken"
import { createUserTokens } from "../../utils/userTokens"
import { envVars } from "../../config/env"
import passport from "passport"

// credentialsLogin by passport local strategy 

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {

        if (err) {
               
            return next(new AppError(401, err))

        }

        if (!user) {
          
            return next(new AppError(401, info.message))
        }

        const userTokens = await createUserTokens(user)


        const { password: pass , ...rest } = user.toObject()


        setAuthCookie(res, userTokens)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest 

            },
        })
    })(req, res, next)


})




//  gwtNewAccestoken      

const getNewAccestoken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken  = req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];
  
    if (!refreshToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is required")
    }


   const TokenInfo = await AuthServices.getNewAccessToken(refreshToken  as string); ;

    // set the new access token in cookies
    setAuthCookie(res, TokenInfo)

sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Generated Successfully",
        data: TokenInfo,
    })
    
}
)  




// logOutUser
const logOutUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    
    // clear the access token cookie 
    res.clearCookie("accessToken" ,  {  
        httpOnly: true,
        secure: false ,
        sameSite: "lax" 
       }  );

    // clear the refresh token cookie
    res.clearCookie("refreshToken"
        , {  
        httpOnly: true,
        secure: false ,
        sameSite: "lax" 

       }
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    })

})

// chang-password is a placeholder for future implementation

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed .......... Successfully",
        data: null,
    })
})




// googleCallbackController
const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  
    let redirectTo = req.query.state ? req.query.state as string : ""
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }


    const user = req.user;

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    const tokenInfo = createUserTokens(user)

    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})




export const AuthControllers = {
    credentialsLogin,
    getNewAccestoken ,
    logOutUser,
    changePassword
    , googleCallbackController
   
}