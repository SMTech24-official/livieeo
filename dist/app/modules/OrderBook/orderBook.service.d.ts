import { OrderBook } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { IGenericResponse } from "../../../interfaces/common";
export declare const OrderBookServices: {
    createBookOrderIntoDB: (payload: {
        bookIds: string[];
    }, user: JwtPayload) => Promise<{
        orderId: string;
        paymentUrl: string | null;
    }>;
    getAllOrderedBooksFromDB: (query: Record<string, any>) => Promise<IGenericResponse<OrderBook[]>>;
    getMyOrderedBooksFromDB: (query: Record<string, any>, userEmail: string) => Promise<IGenericResponse<OrderBook[]>>;
};
//# sourceMappingURL=orderBook.service.d.ts.map