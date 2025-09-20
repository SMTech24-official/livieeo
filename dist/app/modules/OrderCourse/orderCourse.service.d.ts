import { JwtPayload } from "jsonwebtoken";
import { IGenericResponse } from "../../../interfaces/common";
import { OrderCourse } from "@prisma/client";
export declare const OrderCourseServices: {
    createCourseOrderIntoDB: (payload: {
        courseIds: string[];
    }, user: JwtPayload) => Promise<{
        orderId: string;
        paymentUrl: string | null;
    }>;
    getAllOrderedCoursesFromDB: (query: Record<string, any>) => Promise<IGenericResponse<OrderCourse[]>>;
    getMyOrderedCoursesFromDB: (query: Record<string, any>, userId: string) => Promise<IGenericResponse<OrderCourse[]>>;
};
//# sourceMappingURL=orderCourse.service.d.ts.map