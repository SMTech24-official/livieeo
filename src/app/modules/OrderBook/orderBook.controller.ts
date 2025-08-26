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

const getAllOrderedBooks = catchAsync(async(req,res)=> {
    const query = req.query;
    const result = await OrderBookServices.getAllOrderedBooksFromDB(query);
    sendResponse(res,{
        statusCode: httpStatus.OK, 
        success: true,
        message: "Ordered books retrieved successfully",
        data: result.data,
        meta: result.meta
    })
})

const getMyOrderedBooks = catchAsync(async(req,res)=> {
    const user = req.user as JwtPayload;
    const result = await OrderBookServices.getMyOrderedBooksFromDB(req.query,user.email);
    sendResponse(res,{
        statusCode: httpStatus.OK, 
        success: true,
        message: "My Ordered books retrieved successfully",
        data: result.data,
        meta: result.meta
    })
})


export const OrderBookControllers = {
    createBookOrder,
    getAllOrderedBooks,
    getMyOrderedBooks
}