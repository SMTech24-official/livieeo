"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitorLogger = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const visitorLogger = async (req, res, next) => {
    try {
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
        const userAgent = req.headers["user-agent"] || "unknown";
        await prisma_1.default.webVisitor.create({
            data: { ip, userAgent },
        });
    }
    catch (error) {
        console.error("Visitor log failed:", error);
    }
    next();
};
exports.visitorLogger = visitorLogger;
//# sourceMappingURL=visitorLogger.js.map