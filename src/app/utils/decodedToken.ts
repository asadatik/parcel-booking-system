/* eslint-disable no-console */


import  jwt, { JwtPayload }  from "jsonwebtoken";
import AppError from "../errorHelper/appError";
import { envVars } from "../config/env";






export const decodedToken = (token: string): { userId: string; role: string; email: string } => {
  try {
    const decoded = jwt.verify(token,  envVars.JWT_ACCESS_SECRET as string) as JwtPayload;
    
    console.log("Decoded token in decodedToken function:", decoded);

    return {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new AppError(401, "Invalid or expired token");

  }
};
