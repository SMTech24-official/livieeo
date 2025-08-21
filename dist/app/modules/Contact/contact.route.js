"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRoutes = void 0;
const express_1 = require("express");
const contact_controller_1 = require("./contact.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), contact_controller_1.ContactControllers.saveContact);
exports.ContactRoutes = router;
//# sourceMappingURL=contact.route.js.map