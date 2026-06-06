"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toStringValue = toStringValue;
exports.toStringValueOrUndefined = toStringValueOrUndefined;
function toStringValue(value) {
    if (value === undefined || value === null)
        return '';
    return Array.isArray(value) ? String(value[0]) : String(value);
}
function toStringValueOrUndefined(value) {
    if (value === undefined || value === null)
        return undefined;
    return Array.isArray(value) ? String(value[0]) : String(value);
}
