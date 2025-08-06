import { IParcel, ICreateParcelPayload, IUpdateParcelStatusPayload, IParcelStatus } from "./parcel.interface";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import { Parcel } from "./parcel.model";
import AppError from "../../errorHelper/appError";
import { Role } from "../user/user.interface";
import crypto from "crypto";


const prepareParcelResponse = (parcel: IParcel): IParcel => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { ...rest } = (parcel as any).toJSON();
  return rest as IParcel;
};
 
//  generateTrackingId  

// const generateTrackingId = (): string => {
//   const date = new Date();
//   const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
//   const randomChars = Math.random().toString(36).substr(2, 6).toUpperCase();
//   return `TRK-${formattedDate}-${randomChars}`;
// };

const generateTrackingId = (): string => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const randomBytes = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 chars
  return `TRK-${formattedDate}-${randomBytes}`;
};


//createdParcel 
const createParcel = async (
  payload: ICreateParcelPayload,
  senderId: string,
): Promise<IParcel> => {

  // Ensure receiver.userId is a valid ObjectId if provided
  let receiverUserId: Types.ObjectId | undefined;
  if (payload.receiver.userId && Types.ObjectId.isValid(payload.receiver.userId)) {
    receiverUserId = new Types.ObjectId(payload.receiver.userId);
  }



  const newParcelData: IParcel = {
    // Other data
    parcelType: payload.parcelType,
    weight: payload.weight,
    deliveryAddress: payload.deliveryAddress,
    
    // basic data
    trackingId: generateTrackingId(),
    sender: new Types.ObjectId(senderId),
    receiver: {
      name: payload.receiver.name,
      phone: payload.receiver.phone,
      address: payload.receiver.address,
      userId: receiverUserId,
    },
    currentStatus: IParcelStatus.Requested,
    isCancelled: false,
    isDelivered: false,
    statusLogs: [
      {
        status: IParcelStatus.Requested,
        timestamp: new Date(),
        updatedBy: new Types.ObjectId(senderId),
        note: "Parcel delivery request created by sender",
      },
    ],
  };

  const newParcel = await Parcel.create(newParcelData);
  return prepareParcelResponse(newParcel);
};


//get all parcel 
const getAllParcels = async (): Promise<IParcel[]> => {
  const parcels = await Parcel.find({}).populate("sender").populate("receiver.userId");
  return parcels.map((parcel) => prepareParcelResponse(parcel as IParcel));
};


//getSingleParcel

const getSingleParcel = async (parcelId: string, user: JwtPayload): Promise<IParcel | null> => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "not found")       
  }


  if (user.role === Role.ADMIN || parcel.sender.toString() === user.userId || parcel.receiver.userId?.toString() === user.userId) {
    return prepareParcelResponse(parcel as IParcel);
  }

  throw new AppError( httpStatus.NOT_FOUND, 'not found'   );
};


//cancel

const cancelParcel = async (parcelId: string, senderId: string): Promise<IParcel> => {
  const parcel = await Parcel.findById(parcelId);

    // Parcel ID validation
  if (!Types.ObjectId.isValid(parcelId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid Parcel ID");
  }

  if (!parcel) {
    throw new AppError( httpStatus.NOT_FOUND , "Parcel not found", );
  }

 
  if (parcel.sender.toString() !== senderId.toString()) { 
    throw new AppError( httpStatus.FORBIDDEN ,"You are not authorized",   );
  }


  //updated 
  const updatedParcel = await Parcel.findByIdAndUpdate(
    parcelId,
    {
      isCancelled: true,
      currentStatus: IParcelStatus.Cancelled,
      $push: {
        statusLogs: {
          status: IParcelStatus.Cancelled,
          timestamp: new Date(),
          updatedBy: new Types.ObjectId(senderId.toString()), 
          note: "Parcel was cancelled by sender",
        },
      },
    },
    { new: true },
  );

  return prepareParcelResponse(updatedParcel as IParcel);
};


// updateParcelStatus
const updateParcelStatus = async (
  parcelId: string,
  payload: IUpdateParcelStatusPayload,
  adminId: string,
): Promise<IParcel> => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError(  httpStatus.NOT_FOUND , "Parcel not found",  );
  }

  const currentStatus = parcel.currentStatus;
  const newStatus = payload.status;
  if (
    (currentStatus === IParcelStatus.Requested && newStatus !== IParcelStatus.Approved && newStatus !== IParcelStatus.Cancelled ) ||
    (currentStatus === IParcelStatus.Approved && newStatus !== IParcelStatus.Dispatched && newStatus !== IParcelStatus.Cancelled ) ||
    (currentStatus === IParcelStatus.Dispatched && newStatus !== IParcelStatus.InTransit && newStatus !== IParcelStatus.Delivered) ||
    (currentStatus === IParcelStatus.InTransit && newStatus !== IParcelStatus.Delivered) ||
    (currentStatus === IParcelStatus.Delivered || currentStatus === IParcelStatus.Cancelled || currentStatus === IParcelStatus.Returned)
  ) {
    throw new AppError(  httpStatus.BAD_REQUEST , 'Cannot change status from currentStatus to newStatus'  );
  }

  if (parcel.isCancelled || parcel.isDelivered) {
    throw new AppError(httpStatus.BAD_REQUEST ,  "Cannot update a cancelled or delivered parcel."   );
  }

  const updatedParcel = await Parcel.findByIdAndUpdate(
    parcelId,
    {
      currentStatus: newStatus,
      $push: {
        statusLogs: {
          status: newStatus,
          timestamp: new Date(),
          updatedBy: new Types.ObjectId(adminId),
          location: payload.location,
          note: payload.note,
        },
      },
    },
    { new: true },
  );

  return prepareParcelResponse(updatedParcel as IParcel);
};

//getOwn 
const getMyParcels = async (senderId: string): Promise<IParcel[]> => {
  const parcels = await Parcel.find({ sender: new Types.ObjectId(senderId) }).populate("sender").populate("receiver.userId");
  return parcels.map((parcel) => prepareParcelResponse(parcel as IParcel));
};

//GetInComing
const getIncomingParcels = async (receiverId: string): Promise<IParcel[]> => {
  const parcels = await Parcel.find({ "receiver.userId": new Types.ObjectId(receiverId) }).populate("sender").populate("receiver.userId");
  return parcels.map((parcel) => prepareParcelResponse(parcel as IParcel));
};

//removed
const deleteParcel = async (parcelId: string): Promise<IParcel | null> => {
  const deletedParcel = await Parcel.findByIdAndDelete(parcelId);
  if (!deletedParcel) {
      throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
 
  }
  return prepareParcelResponse(deletedParcel as IParcel);
};





export const ParcelServices = {
  createParcel,
  getAllParcels,
  getMyParcels,
  getSingleParcel,
  getIncomingParcels,
  cancelParcel,
  updateParcelStatus,
  deleteParcel,
};