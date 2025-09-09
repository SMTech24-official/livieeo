import { User, UserRole } from "@prisma/client";
import { IGenericResponse } from "../../../interfaces/common";
import { IFile } from "../../../interfaces/file";
import { JwtPayload } from "jsonwebtoken";
interface ICustomerResponse {
    id: string;
    name: string;
    email: string;
    contactNumber: string;
    gender: string;
    address?: string | null;
    photoUrl?: string | null;
    totalSpent: number;
}
export declare const UserServices: {
    registerUserIntoDB: (payload: User, file: IFile) => Promise<{
        message: string;
        userId: string | null;
    }>;
    verifyEmail: (userId: string, code: string) => Promise<{
        message: string;
    }>;
    createAdminIntoDB: (payload: User, file: IFile) => Promise<{
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
    }>;
    getAllUserFromDB: (query: Record<string, any>) => Promise<IGenericResponse<User[]>>;
    getAllCustomersFromDB: (query: Record<string, any>) => Promise<IGenericResponse<ICustomerResponse[]>>;
    getAllAdminFromDB: (query: Record<string, any>) => Promise<IGenericResponse<User[]>>;
    getCustomerByIdFromDB: (id: string) => Promise<{
        id: string;
        name: string;
        email: string;
        contactNumber: string;
        gender: import("@prisma/client").$Enums.Gender;
        address: string | null;
        bio: string | null;
        photoUrl: string | null;
        introduction: string | null;
        education: {
            degree: string | null;
            institution: string | null;
            field: string | null;
        }[];
        socialLinks: {};
        overview: {
            completedCourse: number;
            totalBooks: number;
            totalPurchased: number;
        };
        orders: {
            type: string;
            title: string;
            price: number;
            status: import("@prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
        }[];
    }>;
    updateProfile: (payload: Partial<User>, user: JwtPayload, file?: IFile) => Promise<{
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
    }>;
    updateUserRole: (id: string, role: UserRole) => Promise<{
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
    }>;
    editAdminSetting: (id: string, payload: Partial<User>) => Promise<{
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
    }>;
};
export {};
//# sourceMappingURL=user.service.d.ts.map