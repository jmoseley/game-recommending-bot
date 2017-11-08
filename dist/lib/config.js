"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isLocalDev() {
    return !!process.env.DEV;
}
exports.isLocalDev = isLocalDev;
