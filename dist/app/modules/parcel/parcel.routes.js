"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelRoutes = void 0;
const express_1 = require("express");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const parcel_validations_1 = require("./parcel.validations");
const parcel_controller_1 = require("./parcel.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const router = (0, express_1.Router)();
// Parcel routes
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER, user_interface_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(parcel_validations_1.createParcelZodSchema), parcel_controller_1.ParcelControllers.createParcel);
// Get all parcels
router.get("/all", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.ParcelControllers.getAllParcel);
// Get parcels by sender
router.get("/my", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER, user_interface_1.Role.ADMIN), parcel_controller_1.ParcelControllers.getMyParcels);
// Get incoming parcels for receiver
router.get("/incoming", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelControllers.getIncomingParcels);
// Get single parcel by ID
router.get("/:id", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), parcel_controller_1.ParcelControllers.getSingleParcel);
// Update parcel status
router.patch("/:id/cancel", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER), parcel_controller_1.ParcelControllers.cancelParcel);
// Confirm parcel delivery by receiver
router.patch("/confirm/:parcelId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelControllers.confirmParcelDelivery);
// Update parcel status by admin
router.patch("/:id/status", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.ParcelControllers.updateParcelStatus);
// Get delivery history
router.get("/:receiverId/history", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelControllers.getDeliveryHistory);
exports.ParcelRoutes = router;
