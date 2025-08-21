import { OrderCourse } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
export declare const OrderCourseServices: {
    createCourseOrderIntoDB: (payload: OrderCourse, user: JwtPayload) => Promise<{
        orderId: string;
        paymentUrl: string | null;
    }>;
};
//# sourceMappingURL=orderCourse.service.d.ts.map