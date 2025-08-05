import { Types } from "mongoose";

export enum Role{
    SENDER = "SENDER",
    ADMIN = "ADMIN",
    RECEIVER = "RECEIVER",
}

export interface  IAuthProvider {
  provider: string;
  providerId: string;
}

export enum isActive{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
    DELETED = "DELETED",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  picture?: string;
  address?: string;
  role: Role;
  isDeleted ?: boolean;
  isActive ?: isActive;
  isVerified ?: boolean;
  auth:  IAuthProvider[];

}

