/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";

import { verifyToken } from "../utils/jwt";
import httpStatus from "http-status-codes"

import AppError from "../errorHelper/appError";
import { User } from "../modules/user/user.model";
import { isActive } from "../modules/user/user.interface";


export const checkAuth = (...authRoles: string[]) => 
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("authRoles from checkAuth", authRoles);
    try {
      const accessToken = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.cookies.accessToken;

// const accessToken = req.headers.authorization || req.cookies.accessToken 

      if (!accessToken) {
        throw new AppError(403, "No Token Received");
      }

      const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;
      console.log("verifiedToken from checkAuth", verifiedToken);

      const isUserExist = await User.findOne({ email: verifiedToken.email });

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }
      if (isUserExist.isActive === isActive.BLOCKED || isUserExist.isActive === isActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`);
      }
      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route!!!");
      }

      (req as any).user = verifiedToken; // ✅ attach user to req
      console.log("req.user set in checkAuth", req.user);

      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
};
