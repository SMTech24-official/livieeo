"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextSpeakerId = exports.getNextAdminId = exports.getNextUserId = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getNextUserId = async () => {
    const counter = await prisma_1.default.counter.upsert({
        where: { name: "userId" },
        update: { seq: { increment: 1 } },
        create: { name: "userId", seq: 1 }
    });
    return String(counter.seq).padStart(6, "0");
};
exports.getNextUserId = getNextUserId;
const getNextAdminId = async () => {
    const counter = await prisma_1.default.counter.upsert({
        where: { name: "userId" },
        update: { seq: { increment: 1 } },
        create: { name: "userId", seq: 1 }
    });
    return `A-${String(counter.seq).padStart(6, "0")}`;
};
exports.getNextAdminId = getNextAdminId;
const getNextSpeakerId = async () => {
    const counter = await prisma_1.default.counter.upsert({
        where: { name: "userId" },
        update: { seq: { increment: 1 } },
        create: { name: "userId", seq: 1 }
    });
    return `S-${String(counter.seq).padStart(6, "0")}`;
};
exports.getNextSpeakerId = getNextSpeakerId;
//# sourceMappingURL=userId.js.map