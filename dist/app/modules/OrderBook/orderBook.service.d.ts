import { OrderBook } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
export declare const OrderBookServices: {
    createBookOrderIntoDB: (payload: OrderBook, user: JwtPayload) => Promise<{
        orderId: string;
        paymentUrl: string | null;
    }>;
    getMyBooksFromDB: (userId: string) => Promise<OrderBook[]>;
};
//# sourceMappingURL=orderBook.service.d.ts.map