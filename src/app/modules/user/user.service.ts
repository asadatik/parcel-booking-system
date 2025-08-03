
import { JwtPayload } from "jsonwebtoken";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs"
import AppError from "../../errorHelper/appError";
import { envVars } from "../../config/env";

// create a new user
const createUser = async (payload: Partial<IUser>) => {
    const { email, password , ...rest} = payload;


    // check if user already exists
    const isUserExit = await User.findOne({ email });
    
    // if (isUserExit) {

    //     throw new Error("User already exists with this email");
    // }


    const hashedPassword = await bcryptjs.hash(password as string, 10)



        const authProvider : IAuthProvider = {
        provider: "credentials",
        providerId: email as string,
        }



    
    const user = await User.create({
        email,
        password: hashedPassword,
        auths : [authProvider],
       ...rest
    })

    return   user

}

// get all users

const getAllUsers = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
};



/////////  updated user ////
const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }



    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }

        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}

export const UserServices = {
    createUser,
    getAllUsers
    
}
