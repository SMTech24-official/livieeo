"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const subscription_service_1 = require("./subscription.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const createSubscription = (0, catchAsync_1.default)(async (req, res) => {
    const { planId } = req.params;
    const user = req.user;
    const result = await subscription_service_1.SubscriptionServices.createSubscriptionIntoDB(planId, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Subscription request sent successfully",
        data: result,
    });
});
const getAllSubscriptions = (0, catchAsync_1.default)(async (req, res) => {
    const result = await subscription_service_1.SubscriptionServices.getAllSubscriptionsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "All subscription request retrived successfully",
        data: result,
    });
});
const connectSubscription = (0, catchAsync_1.default)(async (req, res) => {
    const { subscriptionId } = req.params;
    const result = await subscription_service_1.SubscriptionServices.connectSubscriptionIntoDB(subscriptionId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Subscription connected successfully !",
        data: result,
    });
});
const getMySubscription = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await subscription_service_1.SubscriptionServices.getMySubscriptionFromDB(user?.id, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "My subscription retrived successfully !",
        data: result,
    });
});
exports.SubscriptionControllers = {
    createSubscription,
    getAllSubscriptions,
    connectSubscription,
    getMySubscription
};
//# sourceMappingURL=subscription.controller.js.map