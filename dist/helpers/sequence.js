"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextSequence = void 0;
const prisma_1 = __importDefault(require("../shared/prisma"));
const nextSequence = async (name) => {
    const upd = await prisma_1.default.counter.upsert({
        where: { name },
        update: { seq: { increment: 1 } },
        create: { name, seq: 1000 }, // শুরু 1000 থেকে
    });
    return upd.seq;
};
exports.nextSequence = nextSequence;
//# sourceMappingURL=sequence.js.map