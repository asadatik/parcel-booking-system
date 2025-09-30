import { z } from "zod";
import { IParcelStatus } from "./parcel.interface";
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


export const createParcelZodSchema = z.object({
  receiver: z.string().email("Receiver email is invalid"),
  parcelType: z
    .string()
    .min(1, "Please provide a parcelType")
    .max(50, "Limit parcelType address to 50 characters"),
  weight: z.coerce.number().positive("need positive number"),  // 🔥 coerce added
  deliveryAddress: z
    .string()
    .min(1, "Please provide a delivery address")
    .max(200, "Limit your delivery address to 200 characters"),
  parcelFee: z.coerce.number().positive("need positive number"), // 🔥 coerce added
  DeliveryDate: z.coerce.date().min(new Date(), "Delivery date must be in the future"), // 🔥 string → Date
});



export const updateParcelStatusZodSchema = z.object({
  status: z.enum([...Object.values(IParcelStatus)] as [string, ...string[]]),
  location: z.string().min(1, "Please provide a location").optional(),
  note: z.string().min(1, "Please provide a note").optional(),
});

export const cancelParcelZodSchema = z.object({});
