import { Types } from "mongoose";

export enum role{
    SENDER = "SENDER",
    ADMIN = "ADMIN",
    RECIVER = "RECIVER",
}

export interface IAuth {
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
  role: role;
  isDeleted ?: boolean;
  isActive ?: isActive;
  isVarified ?: boolean;
  auth: IAuth[];

}

