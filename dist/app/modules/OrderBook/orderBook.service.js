"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderBookServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const stripe_1 = __importDefault(require("../../../helpers/stripe"));
const config_1 = __importDefault(require("../../../config"));
const createBookOrderIntoDB = async (payload, user) => {
    const userId = user.id;
    const { bookId, paymentMethod } = payload;
    // find book
    const book = await prisma_1.default.book.findUnique({
        where: { id: bookId },
    });
    if (!book) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Book not found !");
    }
    // create order in DB
    const order = await prisma_1.default.orderBook.create({
        data: {
            userId,
            bookId,
            amount: book.price,
            paymentMethod,
            paymentStatus: "PENDING",
        },
    });
    // stripe checkout session (hosted payment page)
    const session = await stripe_1.default.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: book.bookName,
                        description: book.description ?? "Book purchase",
                    },
                    unit_amount: Math.round(book.price * 100), // amount in cents
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        // success_url: `http://localhost:5000/payment/success?orderId=${order.id}`,
        // cancel_url: `http://localhost:5000/payment/cancel?orderId=${order.id}`,
        success_url: `${config_1.default.stripe.success_url}`,
        cancel_url: `${config_1.default.stripe.fail_url}`,
        metadata: {
            orderId: order.id,
            userId,
        },
    });
    return {
        orderId: order.id,
        paymentUrl: session.url, // direct payment URL
    };
};
const getMyBooksFromDB = async (userId) => {
    const result = await prisma_1.default.orderBook.findMany({
        where: {
            userId,
            // paymentStatus: PaymentStatus.PAID
        }
    });
    if (!result || result.length === 0) {
        throw new ApiError_1.default(404, "No books found for this user");
    }
    return result;
};
exports.OrderBookServices = {
    createBookOrderIntoDB,
    getMyBooksFromDB
};
//# sourceMappingURL=orderBook.service.js.map