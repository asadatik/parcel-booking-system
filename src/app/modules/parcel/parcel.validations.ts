// src/modules/parcel/parcel.validation.ts

import { z } from "zod";
import { IParcelStatus } from "./parcel.interface";

export const createParcelZodSchema = z.object({
  receiver: z
    .object({
      name: z
        .string()
        .min(4, "Name must be at least four characters long")
        .max(50, "Receiver name cannot exceed 50 characters"),
      phone: z
        .string()
        .regex(/^01[0-9]{9}$/, "Invalid Bangladeshi phone number")
        .min(11, "Phone number must be 11 digits")
        .max(11, "Phone number must be 11 digits"),
      address: z
        .string()
        .min(1, "Receiver address is required")
        .max(200, "Receiver address cannot exceed 200 characters"),
      userId: z.string().optional(),
    })
    .strict(), // .strict() ensures no extra properties are allowed
  parcelType: z
    .string()
    .min(1, "Parcel type is required")
    .max(50, "Parcel type cannot exceed 50 characters"),
  weight: z.number().positive("Weight must be a positive number"),
  deliveryAddress: z
    .string()
    .min(1, "Delivery address is required")
    .max(200, "Delivery address cannot exceed 200 characters"),
});

export const updateParcelStatusZodSchema = z.object({
  status: z.enum([...Object.values(IParcelStatus)] as [string, ...string[]]),
  location: z.string().min(1, "Location cannot be empty").optional(),
  note: z.string().min(1, "Note cannot be empty").optional(),
});

export const cancelParcelZodSchema = z.object({});
