"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelServices = exports.getIncomingParcels = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
const parcel_interface_1 = require("./parcel.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const parcel_model_1 = require("./parcel.model");
const appError_1 = __importDefault(require("../../errorHelper/appError"));
const user_interface_1 = require("../user/user.interface");
const crypto_1 = __importDefault(require("crypto"));
const prepareParcelResponse = (parcel) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rest = __rest(parcel.toJSON(), []);
    return rest;
};
//  generateTrackingId  
const generateTrackingId = () => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
    const randomBytes = crypto_1.default.randomBytes(3).toString("hex").toUpperCase(); // 6 chars
    return `TRK-${formattedDate}-${randomBytes}`;
};
// create 
const createParcel = (payload, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    // ❌ আর receiver lookup করে User collection থেকে id নেওয়ার দরকার নাই
    // const receiverUser = await User.findOne({ email: payload.receiver });
    // if (!receiverUser) {
    //   throw new AppError(httpStatus.NOT_FOUND, "Receiver not found");
    // }
    const newParcelData = {
        trackingId: generateTrackingId(),
        sender: new mongoose_1.Types.ObjectId(senderId),
        // ✅ সরাসরি email string save করবো
        receiver: payload.receiver,
        parcelType: payload.parcelType,
        weight: payload.weight,
        deliveryAddress: payload.deliveryAddress,
        parcelFee: payload.parcelFee,
        DeliveryDate: payload.DeliveryDate || now,
        currentStatus: parcel_interface_1.IParcelStatus.Requested,
        isCancelled: false,
        isDelivered: false,
        isBlocked: false,
        statusLogs: [
            {
                status: parcel_interface_1.IParcelStatus.Requested,
                timestamp: now,
                updatedBy: new mongoose_1.Types.ObjectId(senderId),
                note: "Parcel delivery request created by sender",
            },
        ],
        createdAt: now,
        updatedAt: now,
    };
    const newParcel = yield parcel_model_1.Parcel.create(newParcelData);
    return prepareParcelResponse(newParcel);
});
//get all parcel 
const getAllParcels = () => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_model_1.Parcel.find({}).populate("sender").populate("receiver.userId");
    return parcels.map((parcel) => prepareParcelResponse(parcel));
});
//getSingleParcel
const getSingleParcel = (parcelId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "not found");
    }
    if (user.role === user_interface_1.Role.ADMIN || parcel.sender.toString() === user.userId || parcel.receiver === user.email) {
        return prepareParcelResponse(parcel);
    }
    throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'not found');
});
//cancel
const cancelParcel = (parcelId, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    console.log("parcel in cancelParcel service", parcel);
    console.log("senderId in cancelParcel service", senderId);
    // Parcel ID validation
    if (!mongoose_1.Types.ObjectId.isValid(parcelId)) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid Parcel ID");
    }
    if (!parcel) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    //updated 
    const updatedParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(parcelId, {
        isCancelled: true,
        currentStatus: parcel_interface_1.IParcelStatus.Cancelled,
        $push: {
            statusLogs: {
                status: parcel_interface_1.IParcelStatus.Cancelled,
                timestamp: new Date(),
                updatedBy: new mongoose_1.Types.ObjectId(senderId.toString()),
                note: "Parcel was cancelled by sender",
            },
        },
    }, { new: true });
    return prepareParcelResponse(updatedParcel);
});
// updateParcelStatus
const updateParcelStatus = (parcelId, payload, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    const currentStatus = parcel.currentStatus;
    const newStatus = payload.status;
    if ((currentStatus === parcel_interface_1.IParcelStatus.Requested && newStatus !== parcel_interface_1.IParcelStatus.Approved && newStatus !== parcel_interface_1.IParcelStatus.Cancelled) ||
        (currentStatus === parcel_interface_1.IParcelStatus.Approved && newStatus !== parcel_interface_1.IParcelStatus.Dispatched && newStatus !== parcel_interface_1.IParcelStatus.Cancelled) ||
        (currentStatus === parcel_interface_1.IParcelStatus.Dispatched && newStatus !== parcel_interface_1.IParcelStatus.InTransit && newStatus !== parcel_interface_1.IParcelStatus.Delivered) ||
        (currentStatus === parcel_interface_1.IParcelStatus.InTransit && newStatus !== parcel_interface_1.IParcelStatus.Delivered) ||
        (currentStatus === parcel_interface_1.IParcelStatus.Delivered || currentStatus === parcel_interface_1.IParcelStatus.Cancelled || currentStatus === parcel_interface_1.IParcelStatus.Returned)) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Cannot change status from currentStatus to newStatus');
    }
    if (parcel.isCancelled || parcel.isDelivered) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot update a cancelled or delivered parcel.");
    }
    const updatedParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(parcelId, {
        currentStatus: newStatus,
        $push: {
            statusLogs: {
                status: newStatus,
                timestamp: new Date(),
                updatedBy: new mongoose_1.Types.ObjectId(adminId),
                location: payload.location,
                note: payload.note,
            },
        },
    }, { new: true });
    return prepareParcelResponse(updatedParcel);
});
//getOwn 
const getMyParcels = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // শুধু ওই user এর parcels ফেরত আনবে
    const parcels = yield parcel_model_1.Parcel.find({ user: userId }).sort({ createdAt: -1 });
    return parcels;
});
// Get Incoming Parcels for a receiver
const getIncomingParcels = (receiverEmail) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Receiver Email in getIncomingParcels service:", receiverEmail);
    const parcels = yield parcel_model_1.Parcel.find({ receiver: receiverEmail }) // email diye match
        .populate("sender"); // sender info populate kora
    return parcels.map((parcel) => prepareParcelResponse(parcel));
});
exports.getIncomingParcels = getIncomingParcels;
//removed
const deleteParcel = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedParcel = yield parcel_model_1.Parcel.findByIdAndDelete(parcelId);
    if (!deletedParcel) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'Parcel not found');
    }
    return prepareParcelResponse(deletedParcel);
});
// ✅ 2. Confirm parcel delivery (change status → Delivered)
const confirmParcelDelivery = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(parcelId, { currentStatus: parcel_interface_1.IParcelStatus.Delivered }, { new: true });
    if (!updatedParcel) {
        throw new Error("Parcel not found or unable to confirm delivery.");
    }
    return updatedParcel;
});
//
const getDeliveryHistory = (receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    // শুধু সেই receiver এর delivered parcels ফেরত আনবে
    const parcels = yield parcel_model_1.Parcel.find({
        receiver: receiverId,
        currentStatus: "Delivered",
    }).populate("sender");
    console.log("Delivered parcels for receiver:", parcels);
    return parcels.map((parcel) => prepareParcelResponse(parcel));
});
exports.ParcelServices = {
    createParcel,
    getAllParcels,
    getMyParcels,
    getSingleParcel,
    getIncomingParcels: exports.getIncomingParcels,
    cancelParcel,
    updateParcelStatus,
    deleteParcel,
    confirmParcelDelivery,
    getDeliveryHistory
};
