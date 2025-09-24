"use strict";
// import { OrderBook } from "@prisma/client";
// import { JwtPayload } from "jsonwebtoken";
// import prisma from "../../../shared/prisma";
// import ApiError from "../../../errors/ApiError";
// import httpStatus from "http-status";
// import stripe from "../../../helpers/stripe";
// import config from "../../../config";
// import { IGenericResponse } from "../../../interfaces/common";
// import QueryBuilder from "../../../helpers/queryBuilder";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderBookServices = void 0;
// const createBookOrderIntoDB = async (
//   payload: { bookIds: string[] },
//   user: JwtPayload
// ) => {
//   const userId = user.id;
//   const { bookIds } = payload;
//   // find all books
//   const books = await prisma.book.findMany({
//     where: { id: { in: bookIds } },
//   });
//   if (books.length === 0) {
//     throw new ApiError(httpStatus.NOT_FOUND, "No books found !");
//   }
//   // total amount sum
//   const totalAmount = books.reduce((sum, book) => sum + book.price, 0);
//   // create order in DB
//   const order = await prisma.orderBook.create({
//     data: {
//       userId,
//       bookIds, // save all bookIds
//       amount: totalAmount
//     },
//   });
//   // stripe checkout session (hosted payment page)
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: books.map((book) => ({
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: book.bookName,
//           description: book.description ?? "Book purchase",
//         },
//         unit_amount: Math.round(book.price * 100), // in cents
//       },
//       quantity: 1,
//     })),
//     mode: "payment",
//     success_url: `${config.stripe.success_url}`,
//     cancel_url: `${config.stripe.fail_url}`,
//     metadata: {
//       orderId: order.id,
//       orderType: "BOOK", // 📌 important to identify
//       userId,
//     },
//   });
//   return {
//     orderId: order.id,
//     paymentUrl: session.url, // direct payment URL
//   };
// };
// const getAllOrderedBooksFromDB = async (query: Record<string, any>): Promise<IGenericResponse<OrderBook[]>> => {
//   const queryBuilder = new QueryBuilder(prisma.orderBook, query);
//   const users = await queryBuilder
//     .range()
//     .search([""])
//     .filter()
//     .sort()
//     .paginate()
//     .fields()
//     .execute({
//   include: {
//     user: true,
//     book: true
//   },
// });
//   const meta = await queryBuilder.countTotal();
//   return { meta, data: users }
// }
// export const OrderBookServices = {
//   createBookOrderIntoDB,
//   getAllOrderedBooksFromDB
// }
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const stripe_1 = __importDefault(require("../../../helpers/stripe"));
const config_1 = __importDefault(require("../../../config"));
const queryBuilder_1 = __importDefault(require("../../../helpers/queryBuilder"));
const dashboard_service_1 = require("../Dashboard/dashboard.service");
// ==========================
// CREATE BOOK ORDER SERVICE
// ==========================
const createBookOrderIntoDB = async (payload, user) => {
    const userId = user.id;
    const { bookIds } = payload;
    // find all books by ids
    const books = await prisma_1.default.book.findMany({
        where: { id: { in: bookIds } },
    });
    if (books.length === 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No books found !");
    }
    // 🔎 check if user already bought any of these books - No Need
    // const alreadyBought = await prisma.orderBookItem.findMany({
    //   where: {
    //     bookId: { in: bookIds },
    //     order: {
    //       userId,
    //       paymentStatus: "PAID",
    //     },
    //   },
    //   select: { bookId: true },
    // });
    // if (alreadyBought.length > 0) {
    //   const boughtBookIds = alreadyBought.map((b) => b.bookId);
    //   const boughtBookNames = books
    //     .filter((b) => boughtBookIds.includes(b.id))
    //     .map((b) => b.bookName)
    //     .join(", ");
    //   throw new ApiError(
    //     httpStatus.BAD_REQUEST,
    //     `You have already purchased these books: ${boughtBookNames}`
    //   );
    // }
    // total amount calculate
    const totalAmount = books.reduce((sum, book) => sum + book.discountPrice, 0);
    const totalBooks = books.length;
    const bookNames = books.map((book) => book.bookName).join(", ");
    // 1️⃣ create order
    const order = await prisma_1.default.orderBook.create({
        data: {
            userId,
            amount: totalAmount,
            paymentStatus: "PENDING",
            paymentMethod: "STRIPE",
        },
    });
    // 2️⃣ create order items (link books to order)
    await prisma_1.default.orderBookItem.createMany({
        data: books.map((book) => ({
            orderId: order.id,
            bookId: book.id,
            price: book.discountPrice,
            quantity: totalBooks,
        })),
    });
    // 3️⃣ Stripe checkout session
    const session = await stripe_1.default.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: books.map((book) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: book.bookName,
                    description: book.description ?? "Book purchase",
                },
                unit_amount: Math.round(book.discountPrice * 100), // convert to cents
            },
            quantity: 1,
        })),
        mode: "payment",
        success_url: `${config_1.default.stripe.success_url}`,
        cancel_url: `${config_1.default.stripe.fail_url}`,
        metadata: {
            orderId: order.id,
            orderType: "BOOK",
            userId,
        },
    });
    (0, dashboard_service_1.saveActivity)(userId, bookNames, client_1.ActivityType.BOOK);
    return {
        orderId: order.id,
        paymentUrl: session.url,
    };
};
// ==========================
// GET ALL ORDERS SERVICE
// ==========================
const getAllOrderedBooksFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.orderBook, query);
    const orders = await queryBuilder
        .range()
        .search([""])
        .filter(["paymentStatus"])
        .sort()
        .paginate()
        .fields()
        .execute({
        include: {
            user: true,
            items: {
                include: {
                    book: true, // প্রতিটি order এর ভিতরে book details আসবে
                },
            },
        },
    });
    const meta = await queryBuilder.countTotal();
    return { meta, data: orders };
};
// ==========================
// GET MY ORDERS SERVICE
// ==========================
const getMyOrderedBooksFromDB = async (query, userEmail) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.orderBook, query);
    const myBooks = await queryBuilder
        .range()
        .search([""])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute({
        where: {
            user: {
                email: userEmail,
            },
            paymentStatus: "PAID",
        },
        include: {
            user: true,
            items: {
                include: {
                    book: true, // প্রতিটি order এর ভিতরে book details আসবে
                },
            },
        },
    });
    const meta = await queryBuilder.countTotal();
    return { meta, data: myBooks };
};
exports.OrderBookServices = {
    createBookOrderIntoDB,
    getAllOrderedBooksFromDB,
    getMyOrderedBooksFromDB,
};
//# sourceMappingURL=orderBook.service.js.map