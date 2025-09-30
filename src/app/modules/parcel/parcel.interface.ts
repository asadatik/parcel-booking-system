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
  receiver: string; // ✅ email from frontend
  parcelType: string;
  weight: number;
  deliveryAddress: string;
  parcelFee: number;
  DeliveryDate: Date;
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
receiver: string | Types.ObjectId;
  parcelType: string; 
  weight: number; 
  deliveryAddress: string;
  currentStatus: IParcelStatus;
  parcelFee: number; 
  DeliveryDate: Date; 
  isCancelled: boolean;
  isDelivered: boolean;
  isBlocked: boolean; 
  statusLogs: IStatusLog[]; 
  createdAt: Date;
  updatedAt: Date;
}




export interface IUpdateParcelStatusPayload {
  status: IParcelStatus;
  location?: string;
  note?: string;
}