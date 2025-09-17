import { Types } from "mongoose";

export enum Role {

    ADMIN = "ADMIN",
    SENDER = "SENDER",
    RECEIVER = "RECEIVER",
   
}



export interface IAuthProvider {
    provider: string;  
    providerId: string;
}

export enum isActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
    DELETED = "DELETED"
}

export interface IUser {
    _id?: Types.ObjectId;

    name: string;

    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isDeleted?: string;
    isActive?: isActive;
    isVerified?: boolean;
    role: Role;
    auths: IAuthProvider[]
    bookings?: Types.ObjectId[]
    guides?: Types.ObjectId[]
}