"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: null },
    picture: { type: String, default: null },
    address: { type: String, default: null },
    role: { type: String, required: true, enum: Object.values(user_interface_1.Role) },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: String, enum: Object.values(user_interface_1.isActive), default: user_interface_1.isActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    auth: [
        {
            provider: { type: String, required: true },
            providerId: { type: String, required: true },
        },
    ],
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
});
exports.User = (0, mongoose_1.model)("User", userSchema);
