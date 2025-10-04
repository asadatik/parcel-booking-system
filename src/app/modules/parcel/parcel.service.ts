/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

const generateTrackingId = (): string => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const randomBytes = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 chars
  return `TRK-${formattedDate}-${randomBytes}`;
};



// create 


const createParcel = async (
  payload: ICreateParcelPayload,
  senderId: string,
): Promise<IParcel> => {
  const now = new Date();

  // ❌ আর receiver lookup করে User collection থেকে id নেওয়ার দরকার নাই
  // const receiverUser = await User.findOne({ email: payload.receiver });
  // if (!receiverUser) {
  //   throw new AppError(httpStatus.NOT_FOUND, "Receiver not found");
  // }

  const newParcelData: IParcel = {
    trackingId: generateTrackingId(),
    sender: new Types.ObjectId(senderId),

    // ✅ সরাসরি email string save করবো
    receiver: payload.receiver,

    parcelType: payload.parcelType,
    weight: payload.weight,
    deliveryAddress: payload.deliveryAddress,
    parcelFee: payload.parcelFee,
    DeliveryDate: payload.DeliveryDate || now,
    currentStatus: IParcelStatus.Requested,
    isCancelled: false,
    isDelivered: false,
    isBlocked: false,
    statusLogs: [
      {
        status: IParcelStatus.Requested,
        timestamp: now,
        updatedBy: new Types.ObjectId(senderId),
        note: "Parcel delivery request created by sender",
      },
    ],
    createdAt: now,
    updatedAt: now,
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


  if (user.role === Role.ADMIN || parcel.sender.toString() === user.userId || parcel.receiver === user.email) {
    return prepareParcelResponse(parcel as IParcel);
  }

  throw new AppError( httpStatus.NOT_FOUND, 'not found'   );
};


//cancel

const cancelParcel = async (parcelId: string, senderId: string): Promise<IParcel> => {
  const parcel = await Parcel.findById(parcelId);
  console.log("parcel in cancelParcel service", parcel);
console.log("senderId in cancelParcel service", senderId);
    // Parcel ID validation
  if (!Types.ObjectId.isValid(parcelId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid Parcel ID");
  }

  if (!parcel) {
    throw new AppError( httpStatus.NOT_FOUND , "Parcel not found", );
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
const getMyParcels= async (userId: any) => {
  // শুধু ওই user এর parcels ফেরত আনবে
  const parcels = await Parcel.find({ user: userId }).sort({ createdAt: -1 });
  return parcels;
};








// Get Incoming Parcels for a receiver
export const getIncomingParcels = async (receiverEmail: string): Promise<IParcel[]> => {
  console.log("Receiver Email in getIncomingParcels service:", receiverEmail);

  const parcels = await Parcel.find({ receiver: receiverEmail }) // email diye match
    .populate("sender"); // sender info populate kora

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


// ✅ 2. Confirm parcel delivery (change status → Delivered)
const confirmParcelDelivery = async (parcelId: string) => {
  const updatedParcel = await Parcel.findByIdAndUpdate(
    parcelId,
    { currentStatus: IParcelStatus.Delivered },
    { new: true }
  );

  if (!updatedParcel) {
    throw new Error("Parcel not found or unable to confirm delivery.");
  }

  return updatedParcel;
};

//
const getDeliveryHistory = async (receiverId: string): Promise<IParcel[]> => {
  // শুধু সেই receiver এর delivered parcels ফেরত আনবে
  const parcels = await Parcel.find({
    receiver: receiverId,
    currentStatus: "Delivered",
  }).populate("sender");


 console.log("Delivered parcels for receiver:", parcels);


  return parcels.map((parcel) => prepareParcelResponse(parcel as IParcel));
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
  confirmParcelDelivery,
  getDeliveryHistory

};