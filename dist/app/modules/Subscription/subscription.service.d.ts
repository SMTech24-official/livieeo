import { JwtPayload } from "jsonwebtoken";
import { IGenericResponse } from "../../../interfaces/common";
import { Subscription } from "@prisma/client";
type IMySubscriptionResponse = {
    overview: {
        planName: string;
        price: number;
        sessions: number;
        nextBillingDate: Date | null;
    } | null;
    history: {
        id: string;
        date: Date;
        planName: string;
        paymentMethod: string;
        status: string;
        amount: number;
        transactionId: string | null;
    }[];
};
export declare const SubscriptionServices: {
    createSubscriptionIntoDB: (planId: string, user: JwtPayload) => Promise<{
        subscriptionId: string;
        paymentUrl: string | null;
    }>;
    getAllSubscriptionsFromDB: (query: Record<string, unknown>) => Promise<IGenericResponse<Subscription[]>>;
    connectSubscriptionIntoDB: (subscriptionId: string) => Promise<{
        user: {
            id: string;
            userId: string | null;
            firstName: string;
            lastName: string | null;
            email: string;
            password: string;
            role: import("@prisma/client").$Enums.UserRole;
            status: import("@prisma/client").$Enums.UserStatus;
            bio: string | null;
            contactNumber: string;
            gender: import("@prisma/client").$Enums.Gender;
            dob: Date | null;
            address: string | null;
            introduction: string | null;
            photoUrl: string | null;
            isEmailVerified: boolean;
            emailVerificationCode: string | null;
            emailVerificationExpiry: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        plan: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            discountPrice: number;
            description: string[];
            sessions: number;
        };
    } & {
        id: string;
        userId: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        createdAt: Date;
        updatedAt: Date;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        transactionId: string | null;
        planId: string;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    getMySubscriptionFromDB: (userId: string, query: Record<string, unknown>) => Promise<IGenericResponse<IMySubscriptionResponse>>;
};
export {};
//# sourceMappingURL=subscription.service.d.ts.map