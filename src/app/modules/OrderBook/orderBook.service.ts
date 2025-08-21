import { OrderBook, PaymentStatus } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import stripe from "../../../helpers/stripe";
import config from "../../../config";

const createBookOrderIntoDB = async (payload: OrderBook, user: JwtPayload) => {
  const userId = user.id;
  const { bookId, paymentMethod } = payload;

  // find book
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, "Book not found !");
  }

  // create order in DB
  const order = await prisma.orderBook.create({
    data: {
      userId,
      bookId,
      amount: book.price,
      paymentMethod,
      paymentStatus: "PENDING",
    },
  });

  // stripe checkout session (hosted payment page)
  const session = await stripe.checkout.sessions.create({
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
    success_url: `${config.stripe.success_url}`,
    cancel_url: `${config.stripe.fail_url}`,
    metadata: {
      orderId: order.id,
      orderType: "BOOK", // 📌 important
      userId,
    },
  });

  return {
    orderId: order.id,
    paymentUrl: session.url, // direct payment URL
  };
};

const getMyBooksFromDB = async (userId: string): Promise<OrderBook[]> => {
    const result = await prisma.orderBook.findMany({
        where: {
            userId,
            paymentStatus: PaymentStatus.PAID
        }
    });
    if (!result || result.length === 0) {
        throw new ApiError(404, "No books found for this user");
    }
    return result;
}



export const OrderBookServices = {
    createBookOrderIntoDB,
    getMyBooksFromDB
}