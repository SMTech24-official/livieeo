import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

import httpStatus from 'http-status'
import { WebhookServices } from "./webHook.service";

const handleStripeWebHook = catchAsync(async(req,res)=> {
    const sig = req.headers['stripe-signature'] as string;
    const result = await WebhookServices.handleStripeWebHook(req.body,sig)
    sendResponse(res,{
        statusCode: httpStatus.CREATED, 
        success: true,
        message: "Payment paid successfully",
        data: result
    })
})

export const WebhookControllers = {
    handleStripeWebHook
}