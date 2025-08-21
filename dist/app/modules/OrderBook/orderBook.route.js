"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderBookRoutes = void 0;
const express_1 = require("express");
const orderBook_controller_1 = require("./orderBook.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/create", (0, auth_1.default)(client_1.UserRole.USER), orderBook_controller_1.OrderBookControllers.createBookOrder);
exports.OrderBookRoutes = router;
//# sourceMappingURL=orderBook.route.js.map