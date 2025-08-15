"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelParcelZodSchema = exports.updateParcelStatusZodSchema = exports.createParcelZodSchema = void 0;
const zod_1 = require("zod");
const parcel_interface_1 = require("./parcel.interface");
exports.createParcelZodSchema = zod_1.z.object({
    receiver: zod_1.z
        .object({
        name: zod_1.z
            .string()
            .min(4, "Name must be at least four characters long")
            .max(30, "Please keep the receiver name under 30 characters"),
        phone: zod_1.z
            .string()
            .regex(/^01[0-9]{9}$/, "Invalid Bangladeshi phone number")
            .min(11, "must be 11 digits")
            .max(11, "must be 11 digits"),
        address: zod_1.z
            .string()
            .min(1, "address is required")
            .max(200, "address cannot exceed 200 characters"),
        userId: zod_1.z.string().optional(),
    })
        .strict(),
    parcelType: zod_1.z
        .string()
        .min(1, "Please provide a parcelType")
        .max(50, "Limit parcelType address to 50 characters"),
    weight: zod_1.z.number().positive("need positive number"),
    deliveryAddress: zod_1.z
        .string()
        .min(1, "Please provide a delivery address")
        .max(200, "Limit your delivery address to 200 characters"),
});
exports.updateParcelStatusZodSchema = zod_1.z.object({
    status: zod_1.z.enum([...Object.values(parcel_interface_1.IParcelStatus)]),
    location: zod_1.z.string().min(1, "Please provide a location").optional(),
    note: zod_1.z.string().min(1, "Please provide a note").optional(),
});
exports.cancelParcelZodSchema = zod_1.z.object({});
