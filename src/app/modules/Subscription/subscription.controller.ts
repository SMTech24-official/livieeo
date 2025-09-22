import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../shared/catchAsync";
import { SubscriptionServices } from "./subscription.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createSubscription = catchAsync(async (req, res) => {
  const user = req.user;
  const body = req.body;

  const result = await SubscriptionServices.createSubscriptionIntoDB(
    body.package as string,
    user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Subscription request sent successfully",
    data: result,
  });
});

const getAllSubscriptions = catchAsync(async (req, res) => {
  const result = await SubscriptionServices.getAllSubscriptionsFromDB(
    req.query
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "All subscription request retrieved successfully",
    data: result,
  });
});

const connectSubscription = catchAsync(async (req, res) => {
  const { subscriptionId } = req.params;
  const result = await SubscriptionServices.connectSubscriptionIntoDB(
    subscriptionId as string
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Subscription connected successfully !",
    data: result,
  });
});
const getMySubscription = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await SubscriptionServices.getMySubscriptionFromDB(
    user?.id as string,
    req.query
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "My subscription retrieved successfully !",
    data: result,
  });
});

export const SubscriptionControllers = {
  createSubscription,
  getAllSubscriptions,
  connectSubscription,
  getMySubscription,
};
