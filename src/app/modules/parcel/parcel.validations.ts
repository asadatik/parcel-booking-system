import { z } from "zod";
import { IParcelStatus } from "./parcel.interface";
export const createParcelZodSchema = z.object({
  receiver: z
    .object({
      name: z
        .string()
        .min(4, "Name must be at least four characters long")
        .max(30, "Please keep the receiver name under 30 characters"),
      phone: z
        .string()
        .regex(/^01[0-9]{9}$/, "Invalid Bangladeshi phone number")
        .min(11, "must be 11 digits")
        .max(11, "must be 11 digits"),
      address: z
        .string()
        .min(1, "address is required")
        .max(200,"address cannot exceed 200 characters"),
      userId: z.string().optional(),
    })     
    .strict(), 
  parcelType: z
    .string()
    .min(1, "Please provide a parcelType")
    .max(50, "Limit parcelType address to 50 characters"),
  weight: z.number().positive("need positive number"),
  deliveryAddress: z
    .string()
    .min(1, "Please provide a delivery address")
    .max(200, "Limit your delivery address to 200 characters"),
});
export const updateParcelStatusZodSchema = z.object({
  status: z.enum([...Object.values(IParcelStatus)] as [string, ...string[]]),
  location: z.string().min(1, "Please provide a location").optional(),
  note: z.string().min(1, "Please provide a note").optional(),
});

export const cancelParcelZodSchema = z.object({});
