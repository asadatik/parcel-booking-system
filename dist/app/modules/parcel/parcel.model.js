"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
//
const statusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.IParcelStatus),
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
    location: {
        type: String,
        trim: true,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    note: {
        type: String,
        trim: true,
    },
}, { _id: false });
//
const parcelSchema = new mongoose_1.Schema({
    trackingId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: { type: String, ref: 'User', required: true },
    parcelType: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
        trim: true,
    },
    currentStatus: {
        type: String,
        enum: Object.values(parcel_interface_1.IParcelStatus),
        default: parcel_interface_1.IParcelStatus.Requested,
        required: true,
    },
    parcelFee: {
        type: Number,
        required: true,
    },
    DeliveryDate: {
        type: Date,
        required: true,
    },
    isCancelled: {
        type: Boolean,
        default: false,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    statusLogs: {
        type: [statusLogSchema],
        required: true,
        default: [],
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
        getters: true,
    },
});
exports.Parcel = (0, mongoose_1.model)("Parcel", parcelSchema);
