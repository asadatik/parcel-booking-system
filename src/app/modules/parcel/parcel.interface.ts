// src/modules/parcel/parcel.interface.ts

import { Types } from "mongoose";
export enum IParcelStatus {
    Requested = "Requested",
    Approved = "Approved",
    Dispatched = "Dispatched",
    Picked = "Picked",
    InTransit = "In Transit",
    Delivered = "Delivered",
    Returned = "Returned",
    Cancelled = "Cancelled",
}

export interface ICreateParcelPayload {
  receiver: {
    name: string;
    phone: string;
    address: string;
    userId?: string; 
  };
  parcelType: string;
  weight: number;
  deliveryAddress: string;
}

export interface IUpdateParcelPayload {
  status: IParcelStatus;
  location?: string;
  note?: string;
}


export interface IStatusLog {
  status:IParcelStatus;
  timestamp:Date;
  location?:string; 
  updatedBy?:Types.ObjectId;
  note?:string; 
}

export interface IParcel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  _id?: Types.ObjectId;
  trackingId: string;
  sender: Types.ObjectId; 
  receiver: {
    name: string;
    phone: string;
    address: string;
    userId?: Types.ObjectId;
  };
  parcelType: string; 
  weight: number; 
  deliveryAddress: string;
  currentStatus: IParcelStatus;
  parcelFee?: number; 
  estimatedDeliveryDate?: Date; 
  isCancelled: boolean;
  isDelivered: boolean;
  isBlocked?: boolean; 
  statusLogs: IStatusLog[]; 
  createdAt?: Date;
  updatedAt?: Date;
}




export interface IUpdateParcelStatusPayload {
  status: IParcelStatus;
  location?: string;
  note?: string;
}