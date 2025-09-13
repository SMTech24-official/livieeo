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
import emailSender from "../Auth/emailSender";


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
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

const registerUserIntoDB = async (payload: User, file: IFile) => {
  // 1. Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "User already exists");
  }

  // 2. Upload photo if exists
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    payload.photoUrl = uploadToCloudinary?.secure_url ?? null;
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(payload.password, 12);
  payload.password = hashedPassword;
  payload.userId = await getNextUserId();

  // 4. Generate verification code
  const verificationCode = generateVerificationCode();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  payload.emailVerificationCode = verificationCode;
  payload.emailVerificationExpiry = expiry;

  // 5. Save user in DB (unverified)
  const result = await prisma.user.create({ data: payload });

  // 6. Send verification email
  await emailSender(
    payload.email,
    "Email Verification Code",
    `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Verification</h2>
        <p>Hi ${payload.firstName},</p>
        <p>Your verification code is:</p>
        <h1 style="color: #4f46e5;">${verificationCode}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `
  );

  return {
    message: "User registered successfully. Please verify your email.",
    userId: result.userId,
  };
};
const resendOtp = async (email: string) => {
  // 1) ইউজার খুঁজে বের করা
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // 2) চেক করা, ইমেইল আগেই ভেরিফাই করা হয়ে গেছে কিনা
  if (user.isEmailVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already verified");
  }

  // 3) নতুন OTP generate করা
  const newVerificationCode = generateVerificationCode();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 মিনিট valid থাকবে

  // 4) DB-তে update করা
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationCode: newVerificationCode,
      emailVerificationExpiry: expiry,
    },
  });

  // 5) নতুন OTP ইমেইলে পাঠানো
  await emailSender(
    user.email,
    "Email Verification Code (Resent)",
    `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Verification</h2>
        <p>Hi ${user.firstName},</p>
        <p>Your new verification code is:</p>
        <h1 style="color: #4f46e5;">${newVerificationCode}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `
  );

  return {
    message: "New OTP sent to your email.",
  };
};
const verifyEmail = async (userId: string, code: string) => {
  const user = await prisma.user.findUnique({ where: { userId } });

  if (!user) throw new ApiError(404, "User not found");
  if (user.isEmailVerified) throw new ApiError(400, "Email already verified");
  if (user.emailVerificationCode !== code) throw new ApiError(400, "Invalid code");
  if (user.emailVerificationExpiry! < new Date())
    throw new ApiError(400, "Code expired");

  await prisma.user.update({
    where: { userId },
    data: { isEmailVerified: true, emailVerificationCode: null, emailVerificationExpiry: null },
  });

  return { message: "Email verified successfully!" };
};
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
            id: user.userId,
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



const getCustomerByIdFromDB = async (id: string) => {
  let user = null;

  if (!user) {
    user = await prisma.user.findUnique({
      where: { id }, // _id field (MongoDB ObjectId)
      include: {
        education: true,
        socialLinks: true,
        orderBook: {
          include: {
            items: {
              include: { book: true },
            },
          },
        },
        orderCourse: {
          include: {
            items: {
              include: { course: true },
            },
          },
        },
        courseCertificate: {
          include: { course: true },
        },
      },
    });
  }

  if (!user) {
    throw new Error("User not found");
  }

  // 🧮 Overview calculation
  const completedCourse = user.courseCertificate.length;
  const totalBooks = user.orderBook.reduce(
    (sum, ob) => sum + ob.items.reduce((q, item) => q + item.quantity, 0),
    0
  );

  const totalPurchased =
    user.orderBook.reduce((sum, ob) => sum + ob.amount, 0) +
    user.orderCourse.reduce((sum, oc) => sum + oc.amount, 0);

  // 🛒 Orders list
  const orders = [
    ...user.orderBook.flatMap((ob) =>
      ob.items.map((item) => ({
        type: "Book",
        title: item.book.bookName,
        price: item.price * item.quantity,
        status: ob.paymentStatus,
        createdAt: ob.createdAt,
      }))
    ),
    ...user.orderCourse.flatMap((oc) =>
      oc.items.map((item) => ({
        type: "Course",
        title: item.course.courseTitle,
        price: item.price * item.quantity,
        status: oc.paymentStatus,
        createdAt: oc.createdAt,
      }))
    ),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // 🎯 Response object
  return {
    id: user.userId ?? user.id,
    name: `${user.firstName} ${user.lastName ?? ""}`,
    email: user.email,
    role: user.role,
    contactNumber: user.contactNumber,
    gender: user.gender,
    address: user.address,
    bio: user.bio,
    photoUrl: user.photoUrl,
    introduction: user.introduction,

    education: user.education.map((edu) => ({
      degree: edu.degree,
      institution: edu.institution,
      field: edu.field,
    })),
    socialLinks: user.socialLinks[0] ?? {},

    overview: {
      completedCourse,
      totalBooks,
      totalPurchased,
    },

    orders,
  };
};
const getUserByIdFromDB = async (id: string) => {
  let user = null;

  if (!user) {
    user = await prisma.user.findUnique({
      where: { id }, // _id field (MongoDB ObjectId)
      include: {
        education: true,
        socialLinks: true,
        orderBook: {
          include: {
            items: {
              include: { book: true },
            },
          },
        },
        orderCourse: {
          include: {
            items: {
              include: { course: true },
            },
          },
        },
        courseCertificate: {
          include: { course: true },
        },
      },
    });
  }

  if (!user) {
    throw new Error("User not found");
  }

  // 🧮 Overview calculation
  const completedCourse = user.courseCertificate.length;
  const totalBooks = user.orderBook.reduce(
    (sum, ob) => sum + ob.items.reduce((q, item) => q + item.quantity, 0),
    0
  );

  const totalPurchased =
    user.orderBook.reduce((sum, ob) => sum + ob.amount, 0) +
    user.orderCourse.reduce((sum, oc) => sum + oc.amount, 0);

  // 🛒 Orders list
  const orders = [
    ...user.orderBook.flatMap((ob) =>
      ob.items.map((item) => ({
        type: "Book",
        title: item.book.bookName,
        price: item.price * item.quantity,
        status: ob.paymentStatus,
        createdAt: ob.createdAt,
      }))
    ),
    ...user.orderCourse.flatMap((oc) =>
      oc.items.map((item) => ({
        type: "Course",
        title: item.course.courseTitle,
        price: item.price * item.quantity,
        status: oc.paymentStatus,
        createdAt: oc.createdAt,
      }))
    ),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // 🎯 Response object
  return {
    id: user.userId ?? user.id,
    name: `${user.firstName} ${user.lastName ?? ""}`,
    email: user.email,
    role: user.role,
    contactNumber: user.contactNumber,
    gender: user.gender,
    address: user.address,
    bio: user.bio,
    photoUrl: user.photoUrl,
    introduction: user.introduction,

    education: user.education.map((edu) => ({
      degree: edu.degree,
      institution: edu.institution,
      field: edu.field,
    })),
    socialLinks: user.socialLinks[0] ?? {},

    overview: {
      completedCourse,
      totalBooks,
      totalPurchased,
    },

    orders,
  };
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
    verifyEmail,
    createAdminIntoDB,
    getAllUserFromDB,
    getAllCustomersFromDB,
    getAllAdminFromDB,
    getCustomerByIdFromDB,
    getUserByIdFromDB,
    updateProfile,
    updateUserRole,
    editAdminSetting,
    resendOtp
}