import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../config/env';

import { User } from '../modules/user/user.model';
import { verifyToken } from '../utils/jwt';
import AppError from '../errorHelper/appError';

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const accessToken = req.headers.authorization;
      const accessToken = req.headers.cookie;



      if (!accessToken) {
        throw new AppError(401, 'Token not found');
      }

  
// Token 

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET,
      ) as JwtPayload;

      
      const isUserExist = await User.findOne({
        email: verifiedToken.email,
      });


      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
      }

    
        if (
            isUserExist.isActive === 'BLOCKED' ||
            isUserExist.isActive === 'INACTIVE'  ) {   throw new AppError(  httpStatus.BAD_REQUEST,   `User is ${isUserExist.isActive}`,   )  }


    

      if (isUserExist.isDeleted === true) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User is Deleted');
      }

       

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, 'You are not permitted to view this route!!');
      }

      req.user = verifiedToken;

      next();
    } catch (error) {
      next(error);
    }
  };