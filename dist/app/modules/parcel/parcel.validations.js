"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelParcelZodSchema = exports.updateParcelStatusZodSchema = exports.createParcelZodSchema = void 0;
const zod_1 = require("zod");
const parcel_interface_1 = require("./parcel.interface");
// export const createParcelZodSchema = z.object({
//  receiver: z.string().email("Receiver email is invalid"),
//   parcelType: z
//     .string()
//     .min(1, "Please provide a parcelType")
//     .max(50, "Limit parcelType address to 50 characters"),
//   weight: z.number().positive("need positive number"),
//   deliveryAddress: z
//     .string()
//     .min(1, "Please provide a delivery address")
//     .max(200, "Limit your delivery address to 200 characters"),
//   parcelFee: z.number().positive("need positive number"),
//   DeliveryDate: z.coerce.date().min(new Date(), "Delivery date must be in the future"),
// });
exports.createParcelZodSchema = zod_1.z.object({
    receiver: zod_1.z.string().email("Receiver email is invalid"),
    parcelType: zod_1.z
        .string()
        .min(1, "Please provide a parcelType")
        .max(50, "Limit parcelType address to 50 characters"),
    weight: zod_1.z.coerce.number().positive("need positive number"), // 🔥 coerce added
    deliveryAddress: zod_1.z
        .string()
        .min(1, "Please provide a delivery address")
        .max(200, "Limit your delivery address to 200 characters"),
    parcelFee: zod_1.z.coerce.number().positive("need positive number"), // 🔥 coerce added
    DeliveryDate: zod_1.z.coerce.date().min(new Date(), "Delivery date must be in the future"), // 🔥 string → Date
});
exports.updateParcelStatusZodSchema = zod_1.z.object({
    status: zod_1.z.enum([...Object.values(parcel_interface_1.IParcelStatus)]),
    location: zod_1.z.string().min(1, "Please provide a location").optional(),
    note: zod_1.z.string().min(1, "Please provide a note").optional(),
});
exports.cancelParcelZodSchema = zod_1.z.object({});
