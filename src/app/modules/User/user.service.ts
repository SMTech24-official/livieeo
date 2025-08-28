import { User, UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IGenericResponse } from "../../../interfaces/common";
import QueryBuilder from "../../../helpers/queryBuilder";
import bcrypt from "bcrypt";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import { getNextAdminId, getNextUserId } from "./userId";
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


const registerUserIntoDB = async (payload: User, file: IFile) => {
    const user = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    })

    if (user) {
        throw new ApiError(httpStatus.CONFLICT, "User already exists");
    }
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        payload.photoUrl = uploadToCloudinary?.secure_url ?? null;
    }
    const hashedPassword: string = await bcrypt.hash(payload.password, 12);
    payload.userId = await getNextUserId();
    payload.password = hashedPassword;
    const result = await prisma.user.create({
        data: payload,
    });
    return result;
}
const createAdminIntoDB = async (payload: User, file: IFile) => {
    const user = await prisma.user.findUnique({
        where: {
            email: payload?.email,
        },
    })
    if (user) {
        throw new ApiError(httpStatus.CONFLICT, "User already exists");
    }
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        payload.photoUrl = uploadToCloudinary?.secure_url ?? null;
    }
    payload.userId = await getNextAdminId();
    payload.role = UserRole.ADMIN
    const hashedPassword: string = await bcrypt.hash(payload.password, 12);
    payload.password = hashedPassword;
    const result = await prisma.user.create({
        data: payload,
    });
    return result;
}

const getAllUserFromDB = async (query: Record<string, any>): Promise<IGenericResponse<User[]>> => {
    const queryBuilder = new QueryBuilder(prisma.user, query);
    const users = await queryBuilder
        .range()
        .search(["firstName", "email"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute({
            where: {
                status: 'ACTIVE',
                role: UserRole.USER
            },
            include: {
                education: true,
                socialLinks: true,
                // orders: true
            }
        });
    const meta = await queryBuilder.countTotal();
    return { meta, data: users }
}


const getAllCustomersFromDB = async (
    query: Record<string, any>
): Promise<IGenericResponse<ICustomerResponse[]>> => {
    const queryBuilder = new QueryBuilder(prisma.user, query);

    const users = await queryBuilder
        .range()
        .search(["firstName", "email"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute({
            where: { role: "USER" },
            include: {
                orderBook: true,
                orderCourse: true
            },
        });

    // map করে নতুন ডাটা বানালাম
    const formattedUsers: ICustomerResponse[] = users.map((user: any) => {
        const totalBook = user.orderBook.reduce((sum: number, ob: any) => sum + ob.amount, 0);
        const totalCourse = user.orderCourse.reduce((sum: number, oc: any) => sum + oc.amount, 0);

        return {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            contactNumber: user.contactNumber,
            gender: user.gender,
            address: user.address,
            photoUrl: user.photoUrl,
            sales: totalBook + totalCourse
        };
    });

    const meta = await queryBuilder.countTotal();

    return { meta, data: formattedUsers };
};


const getAllAdminFromDB = async (query: Record<string, any>): Promise<IGenericResponse<User[]>> => {
    const queryBuilder = new QueryBuilder(prisma.user, query);
    const users = await queryBuilder
        .range()
        .search(["firstName", "email"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute({
            where: {
                status: 'ACTIVE',
                role: UserRole.ADMIN
            },
            include: {
                education: true,
                socialLinks: true,
                orders: true
            }
        });
    const meta = await queryBuilder.countTotal();
    return { meta, data: users }
}

const getUserByIdFromDB = async (id: string) => {
    const result = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })
    return result
}
const updateProfile = async (payload: Partial<User>, user: JwtPayload, file?: IFile) => {
    const userExists = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    })
    if (!userExists) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found")
    }
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        payload.photoUrl = uploadToCloudinary?.secure_url ?? null;
    }
    const result = await prisma.user.update({
        where: {
            id: user.id
        },
        data: payload
    })
    return result;
}
const updateUserRole = async (id: string, role: UserRole) => {
    const userExists = await prisma.user.findUnique({
        where: {
            id
        }
    })
    if (!userExists) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found")
    }
    const result = await prisma.user.update({
        where: {
            id
        },
        data: {
            role
        }
    })
    return result;
}
const editAdminSetting = async (id: string, payload: Partial<User>) => {
    const userExists = await prisma.user.findUnique({
        where: {
            id
        }
    })
    if (!userExists) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found")
    }
    // Only include defined properties in the update data
    const updateData: Record<string, any> = {};
    if (payload.firstName !== undefined) updateData.firstName = payload.firstName;
    if (payload.contactNumber !== undefined) updateData.contactNumber = payload.contactNumber;
    if (payload.email !== undefined) updateData.email = payload.email;
    if (payload.address !== undefined) updateData.address = payload.address;
    if (payload.introduction !== undefined) updateData.introduction = payload.introduction;

    const result = await prisma.user.update({
        where: {
            id
        },
        data: updateData
    })
    return result;
}
export const UserServices = {
    registerUserIntoDB,
    createAdminIntoDB,
    getAllUserFromDB,
    getAllCustomersFromDB,
    getAllAdminFromDB,
    getUserByIdFromDB,
    updateProfile,
    updateUserRole,
    editAdminSetting
}