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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const decodedToken_1 = require("../../utils/decodedToken");
const parcel_service_1 = require("./parcel.service");
const sendResponse_1 = require("../../utils/sendResponse");
const appError_1 = __importDefault(require("../../errorHelper/appError"));
// create parcel controller
const createParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "No token provided");
    }
    const decode = (0, decodedToken_1.decodedToken)(token);
    if (!decode) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid credentials");
    }
    const senderId = decode.userId;
    const result = yield parcel_service_1.ParcelServices.createParcel(req.body, senderId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Parcel created successfully",
        data: result,
    });
}));
// get all parcels controller
const getAllParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield parcel_service_1.ParcelServices.getAllParcels();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All Parcel Retrieved Successfully",
        data: result,
    });
}));
// get single parcel controller
const getSingleParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    const token = req.headers.authorization;
    if (!token) {
        throw new Error("Unauthorized: No token provided");
    }
    const decode = (0, decodedToken_1.decodedToken)(token);
    if (!decode) {
        throw new Error("Unauthorized: Invalid token");
    }
    const result = yield parcel_service_1.ParcelServices.getSingleParcel(id, decode);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Single Parcel Retrieved Successfully",
        data: result,
    });
}));
// get my parcels controller
const getMyParcels = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token) {
        throw new Error("Unauthorized: No token provided");
    }
    const decode = (0, decodedToken_1.decodedToken)(token);
    console.log('fffffffffffffffffffffff', decode);
    if (!decode) {
        throw new Error("Unauthorized: Invalid token");
    }
    const senderId = decode.userId;
    const result = yield parcel_service_1.ParcelServices.getMyParcels(senderId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Sender's parcels retrieved successfully",
        data: result,
    });
}));
// update parcel status controller
const updateParcelStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const token = req.headers.authorization;
    if (!token) {
        throw new Error("Unauthorized: No token provided");
    }
    const decode = (0, decodedToken_1.decodedToken)(token);
    if (!decode) {
        throw new Error("Unauthorized: Invalid token");
    }
    const adminId = decode.userId;
    const { status, location, note } = req.body;
    const result = yield parcel_service_1.ParcelServices.updateParcelStatus(id, { status, location, note }, adminId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Parcel status updated successfully",
        data: result,
    });
}));
// cancel parcel controller
const cancelParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const token = req.headers.authorization;
    if (!token) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    const decode = (0, decodedToken_1.decodedToken)(token);
    if (!decode) {
        throw new Error("Unauthorized: Invalid token");
    }
    const senderId = decode.userId;
    const result = yield parcel_service_1.ParcelServices.cancelParcel(id, senderId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Parcel was cancelled by sender",
        data: result,
    });
}));
// get incoming parcels controller
const getIncomingParcels = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token) {
        throw new Error("Unauthorized: No token provided");
    }
    const decode = (0, decodedToken_1.decodedToken)(token);
    if (!decode) {
        throw new Error("Unauthorized: Invalid token");
    }
    const receiverId = decode.userId;
    const result = yield parcel_service_1.ParcelServices.getIncomingParcels(receiverId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Receiver's incoming parcels retrieved successfully",
        data: result,
    });
}));
exports.ParcelControllers = {
    createParcel,
    getAllParcel,
    getSingleParcel,
    getMyParcels,
    updateParcelStatus,
    cancelParcel,
    getIncomingParcels,
};
