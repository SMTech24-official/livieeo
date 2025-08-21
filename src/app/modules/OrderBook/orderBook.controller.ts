import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../shared/catchAsync";
import { OrderBookServices } from "./orderBook.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status"

const createBookOrder = catchAsync(async(req,res)=> {
    const payload = req.body;
    const user = req.user as JwtPayload;
    const result = await OrderBookServices.createBookOrderIntoDB(payload, user);
    sendResponse(res,{
        statusCode: httpStatus.CREATED, 
        success: true,
        message: "Book order created successfully",
        data: result
    })
})

const handleStripeWebHook = catchAsync(async(req,res)=> {
    const sig = req.headers['stripe-signature'] as string;
    const result = await OrderBookServices.handleStripeWebHook(req.body,sig)
    sendResponse(res,{
        statusCode: httpStatus.CREATED, 
        success: true,
        message: "Payment paid successfully",
        data: result
    })
})

export const OrderBookControllers = {
    createBookOrder,
    handleStripeWebHook
}