import { model, Schema } from "mongoose";
import { IParcel, IParcelStatus, IStatusLog } from "./parcel.interface";
//
const statusLogSchema = new Schema<IStatusLog>(
  {
    status: {
      type: String,
      enum: Object.values(IParcelStatus),
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
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { _id: false }, 
);
//
const parcelSchema = new Schema<IParcel>(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      userId: { type: Schema.Types.ObjectId, ref: "User" }, 
    },
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
      enum: Object.values(IParcelStatus),
      default: IParcelStatus.Requested,
      required: true,
    },
    parcelFee: {
      type: Number,
    },
    estimatedDeliveryDate: {
      type: Date,
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
  },
  {
    timestamps: true, 
    versionKey: false,
    toJSON: {
      virtuals: true,
      getters: true,
    },
  },
);




export const Parcel = model<IParcel>("Parcel", parcelSchema);