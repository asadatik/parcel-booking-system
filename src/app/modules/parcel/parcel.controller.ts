/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { decodedToken } from "../../utils/decodedToken";
import { ParcelServices } from "./parcel.service";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelper/appError";
import { JwtPayload } from "jsonwebtoken";
import { compile } from "ejs";



// create parcel controller
const createParcel = catchAsync(async (req: Request, res: Response) => {



 const token = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.cookies.accessToken;
  
if (!token) {
  throw new AppError(httpStatus.UNAUTHORIZED, "No token provided");
}

  const decode = decodedToken(token as string);
   console.log("Decoded token in createParcel controller:", decode);

if (!decode) {
  throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
}

  const senderId = decode.userId;
  console.log("Sender ID from createParcel controller:", senderId);
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

   const token = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.cookies.accessToken;


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




export const getMyParcels = async (req: Request, res  : Response) => {
  try {
    const userId = req.user._id; // ধরলাম req.user এ auth middleware থেকে আসছে

       console.log("User ID from parcel controller    :", userId);
    const parcels = await ParcelServices.getMyParcels(userId);

    if (!parcels || parcels.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No parcels found for this user",
      });
    }
      console.log("Parcels in controller:", parcels);
    res.status(200).json({
      success: true,
      message: "Parcels fetched successfully",
      data: parcels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch parcels",
      error: error.message,
    });
  }
};



// update parcel status controller

const updateParcelStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
 const token = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.cookies.accessToken;
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
  const decoded = req.user; // ✅ আসছে checkAuth থেকে

  
   console.log("Decoded user from cancelParcel controller:", decoded);
  if (!decoded) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized request");
  }

  const senderId = (decoded as JwtPayload).userId;

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
  const token = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.cookies.accessToken;
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
