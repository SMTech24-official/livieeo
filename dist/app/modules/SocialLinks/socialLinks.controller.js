"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialLinksControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const socialLinks_service_1 = require("./socialLinks.service");
const createSocialLinks = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const result = await socialLinks_service_1.SocialLinksServices.createSocialLinkIntoDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Social link created successfully",
        data: result
    });
});
const updateSocialLinks = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await socialLinks_service_1.SocialLinksServices.updateSocialLinkIntoDB(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Social link updated successfully",
        data: result
    });
});
const deleteSocialLinks = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await socialLinks_service_1.SocialLinksServices.deleteSocialLinkFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Social link deleted successfully",
        data: result
    });
});
const getSocialLinkById = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await socialLinks_service_1.SocialLinksServices.getSocialLinkByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Social link retrieved successfully",
        data: result
    });
});
const getSocialLinks = (0, catchAsync_1.default)(async (req, res) => {
    const result = await socialLinks_service_1.SocialLinksServices.getSocialLinksFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Social links retrieved successfully",
        data: result
    });
});
exports.SocialLinksControllers = {
    createSocialLinks,
    updateSocialLinks,
    deleteSocialLinks,
    getSocialLinkById,
    getSocialLinks
};
//# sourceMappingURL=socialLinks.controller.js.map