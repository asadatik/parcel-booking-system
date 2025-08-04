import { model, Schema } from "mongoose";
import { isActive, IUser, role } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: null },
    picture: { type: String, default: null },
    address: { type: String, default: null },
    role: {
      type: String,
      enum: Object.values(role),
      default: role.SENDER,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(isActive),
      default: isActive.ACTIVE,
    },
    isVarified: { type: Boolean, default: false },
    auth: [
      {
        provider: { type: String, required: true },
        providerId: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  },
);


export const User = model<IUser>("User", userSchema);
