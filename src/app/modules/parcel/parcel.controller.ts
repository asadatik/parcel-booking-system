import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { decodedToken } from "../../utils/decodedToken";
import { ParcelServices } from "./parcel.service";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelper/appError";
import { log } from "console";


// create parcel controller
const createParcel = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
if (!token) {
  throw new AppError(httpStatus.UNAUTHORIZED, "No token provided");
}

  const decode = decodedToken(token as string);

if (!decode) {
  throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
}

  const senderId = decode.userId;

  const result = await ParcelServices.createParcel(req.body, senderId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Parcel created successfully",
    data: result,
  });
});

// get all parcels controller

const getAllParcel = catchAsync(async (req: Request, res: Response) => {
  const result = await ParcelServices.getAllParcels();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Parcel Retrieved Successfully",
    data: result,
  });
});

// get single parcel controller
const getSingleParcel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id) 
  const token = req.headers.authorization;
  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }
  const decode = decodedToken(token as string);

  if (!decode) {
    throw new Error("Unauthorized: Invalid token");
  }

  const result = await ParcelServices.getSingleParcel(id, decode);
  sendResponse(res, {
  statusCode: httpStatus.OK,
    success: true,
    message: "Single Parcel Retrieved Successfully",
    data: result,
  });
});


// get my parcels controller
const getMyParcels = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }
  const decode = decodedToken(token as string);
    console.log('fffffffffffffffffffffff'  ,decode)
  if (!decode) {
    throw new Error("Unauthorized: Invalid token");
  }
  const senderId = decode.userId;

  
  const result = await ParcelServices.getMyParcels(senderId);

  sendResponse(res, {
  statusCode: httpStatus.OK,
    success: true,
    message: "Sender's parcels retrieved successfully",
    data: result,
  });
});


// update parcel status controller

const updateParcelStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const token = req.headers.authorization;
  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }
  const decode = decodedToken(token as string);

  if (!decode) {
    throw new Error("Unauthorized: Invalid token");
  }
  const adminId = decode.userId;
  const { status, location, note } = req.body;

  const result = await ParcelServices.updateParcelStatus(
    id,
    { status, location, note },
    adminId,
  );

  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: "Parcel status updated successfully",
    data: result,
  });
});

// cancel parcel controller

const cancelParcel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const token = req.headers.authorization;
  if (!token) {
  throw new AppError(  httpStatus.NOT_FOUND  , "Parcel not found" );
  }

   


  
  const decode = decodedToken(token as string);

  if (!decode) {
    throw new Error("Unauthorized: Invalid token");
  }
  const senderId = decode.userId;

  const result = await ParcelServices.cancelParcel(id, senderId);

  sendResponse(res, {
  statusCode: httpStatus.OK,
    success: true,
    message: "Parcel was cancelled by sender",
    data: result,
  });
});

// get incoming parcels controller

const getIncomingParcels = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }
  const decode = decodedToken(token as string);

  if (!decode) {
    throw new Error("Unauthorized: Invalid token");
  }
  const receiverId = decode.userId;
  const result = await ParcelServices.getIncomingParcels(receiverId);


  sendResponse(res, {
  statusCode: httpStatus.OK,
    success: true,
    message: "Receiver's incoming parcels retrieved successfully",
    data: result,
  });
});

export const ParcelControllers = {
  createParcel,
  getAllParcel,
  getSingleParcel,
  getMyParcels,
  updateParcelStatus,
  cancelParcel,
  getIncomingParcels,
};
