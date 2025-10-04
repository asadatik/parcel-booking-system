import { Router } from "express";

import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createParcelZodSchema, } from "./parcel.validations";
import { ParcelControllers } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";




const router = Router();
// Parcel routes
router.post("/create", checkAuth(Role.SENDER  , Role.ADMIN  ),validateRequest(createParcelZodSchema), ParcelControllers.createParcel);
// Get all parcels
router.get("/all", checkAuth(Role.ADMIN), ParcelControllers.getAllParcel);
// Get parcels by sender
router.get("/my", checkAuth(Role.SENDER , Role.ADMIN  ), ParcelControllers.getMyParcels);

// Get incoming parcels for receiver
router.get("/incoming", checkAuth(Role.RECEIVER), ParcelControllers.getIncomingParcels);

// Get single parcel by ID
router.get("/:id", checkAuth(...Object.values(Role)), ParcelControllers.getSingleParcel);


// Update parcel status
router.patch("/:id/cancel",  checkAuth(Role.SENDER), ParcelControllers.cancelParcel);

// Confirm parcel delivery by receiver
router.patch("/confirm/:parcelId", checkAuth(Role.RECEIVER), ParcelControllers.confirmParcelDelivery);

// Update parcel status by admin
router.patch("/:id/status", checkAuth(Role.ADMIN), ParcelControllers.updateParcelStatus);

// Get delivery history
router.get("/:receiverId/history",   checkAuth(Role.RECEIVER), ParcelControllers.getDeliveryHistory);




export const ParcelRoutes = router;