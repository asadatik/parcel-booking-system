"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isActive = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SENDER"] = "SENDER";
    Role["ADMIN"] = "ADMIN";
    Role["RECEIVER"] = "RECEIVER";
})(Role || (exports.Role = Role = {}));
var isActive;
(function (isActive) {
    isActive["ACTIVE"] = "ACTIVE";
    isActive["INACTIVE"] = "INACTIVE";
    isActive["BLOCKED"] = "BLOCKED";
    isActive["DELETED"] = "DELETED";
})(isActive || (exports.isActive = isActive = {}));
