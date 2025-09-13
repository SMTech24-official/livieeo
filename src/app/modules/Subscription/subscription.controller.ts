// const createSubscriptionIntoDB = async (
//   planId: string,
//   user: JwtPayload
// )

import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../shared/catchAsync";
import { SubscriptionServices } from "./subscription.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status"

const createSubscription = catchAsync(async(req,res)=> {
    const {planId} = req.params
    const user = req.user
    const result = await SubscriptionServices.createSubscriptionIntoDB(planId as string,user as JwtPayload)
    sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Subscription request sent successfully",
    data: result,
  });
})

// export const SubscriptionServices = {
//   createSubscriptionIntoDB,
//   getAllSubscriptionsFromDB,
//   connectSubscriptionIntoDB,
//   getUserSubscriptionsFromDB,
// };

const getAllSubscriptions = catchAsync(async(req,res)=> {
    const result = await SubscriptionServices.getAllSubscriptionsFromDB(req.query)
    sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "All subscription request retrived successfully",
    data: result,
  });
})

export const SubscriptionControllers = {
  createSubscription,
  getAllSubscriptions
};