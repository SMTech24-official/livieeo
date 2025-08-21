"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parsePrismaValidationError = (errorMessage) => {
    // Parse missing argument errors
    const missingFieldsRegex = /Argument `(.+?)` is missing\./g;
    let match;
    const missingFields = [];
    while ((match = missingFieldsRegex.exec(errorMessage)) !== null) {
        if (match[1]) {
            missingFields.push(match[1]);
        }
    }
    // Parse invalid value errors
    const invalidValueRegex = /Argument `(.+?)`: Invalid value provided\. Expected (.+), provided (.+)\./g;
    const invalidValues = [];
    while ((match = invalidValueRegex.exec(errorMessage)) !== null) {
        const field = match[1];
        const expectedType = match[2];
        const providedValue = match[3];
        if (field && expectedType && providedValue) {
            invalidValues.push(`${field}: Expected ${expectedType}, provided ${providedValue}`);
        }
    }
    const missingFieldsMessage = missingFields.length
        ? `Missing fields: ${missingFields.join(", ")}`
        : "";
    const invalidValuesMessage = invalidValues.length
        ? `Invalid values: ${invalidValues.join("; ")}`
        : "";
    return [
        missingFieldsMessage,
        invalidValuesMessage
    ].filter(Boolean).join("; ");
};
exports.default = parsePrismaValidationError;
//# sourceMappingURL=parsePrismaValidationError.js.map