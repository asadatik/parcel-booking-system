"use strict";
// src/modules/parcel/parcel.interface.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.IParcelStatus = void 0;
var IParcelStatus;
(function (IParcelStatus) {
    IParcelStatus["Requested"] = "Requested";
    IParcelStatus["Approved"] = "Approved";
    IParcelStatus["Dispatched"] = "Dispatched";
    IParcelStatus["Picked"] = "Picked";
    IParcelStatus["InTransit"] = "In Transit";
    IParcelStatus["Delivered"] = "Delivered";
    IParcelStatus["Returned"] = "Returned";
    IParcelStatus["Cancelled"] = "Cancelled";
})(IParcelStatus || (exports.IParcelStatus = IParcelStatus = {}));
