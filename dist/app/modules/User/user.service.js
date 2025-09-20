"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const queryBuilder_1 = __importDefault(require("../../../helpers/queryBuilder"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const userId_1 = require("./userId");
const emailSender_1 = __importDefault(require("../Auth/emailSender"));
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};
const registerUserIntoDB = async (payload, file) => {
    try {
        // 1. Check if user exists
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email: payload.email },
        });
        if (existingUser) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, "User already exists");
        }
        // 2. Upload photo if exists
        if (file) {
            const uploadToCloudinary = await fileUploader_1.fileUploader?.uploadToCloudinary(file);
            payload.photoUrl = uploadToCloudinary?.secure_url ?? null;
        }
        // 3. Hash password
        const hashedPassword = await bcrypt_1.default.hash(payload.password, 12);
        payload.password = hashedPassword;
        payload.userId = await (0, userId_1.getNextUserId)();
        // 4. Generate verification code
        const verificationCode = generateVerificationCode();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        payload.emailVerificationCode = verificationCode;
        payload.emailVerificationExpiry = expiry;
        // 5. Save user in DB (unverified)
        const result = await prisma_1.default.user.create({ data: payload });
        // 6. Send verification email
        await (0, emailSender_1.default)(payload.email, "Email Verification Code", `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Verification</h2>
        <p>Hi ${payload.firstName},</p>
        <p>Your verification code is:</p>
        <h1 style="color: #4f46e5;">${verificationCode}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `);
        return {
            message: "User registered successfully. Please verify your email.",
            userId: result.userId,
        };
    }
    catch (error) {
        console.log(error, 'checking error');
    }
};
const resendOtp = async (email) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (user.isEmailVerified) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Email already verified");
    }
    const newVerificationCode = generateVerificationCode();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    await prisma_1.default.user.update({
        where: { id: user.id },
        data: {
            emailVerificationCode: newVerificationCode,
            emailVerificationExpiry: expiry,
        },
    });
    await (0, emailSender_1.default)(user.email, "Email Verification Code (Resent)", `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Verification</h2>
        <p>Hi ${user.firstName},</p>
        <p>Your new verification code is:</p>
        <h1 style="color: #4f46e5;">${newVerificationCode}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `);
    return {
        message: "New OTP sent to your email.",
    };
};
const verifyEmail = async (email, code) => {
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user)
        throw new ApiError_1.default(404, "User not found");
    if (user.isEmailVerified)
        throw new ApiError_1.default(400, "Email already verified");
    if (user.emailVerificationCode !== code)
        throw new ApiError_1.default(400, "Invalid code");
    if (user.emailVerificationExpiry < new Date())
        throw new ApiError_1.default(400, "Code expired");
    await prisma_1.default.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true, emailVerificationCode: null, emailVerificationExpiry: null },
    });
    return { message: "Email verified successfully!" };
};
const createAdminIntoDB = async (payload, file) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            email: payload?.email,
        },
    });
    if (user) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "User already exists");
    }
    if (file) {
        const uploadToCloudinary = await fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.photoUrl = uploadToCloudinary?.secure_url ?? null;
    }
    payload.userId = await (0, userId_1.getNextAdminId)();
    payload.role = client_1.UserRole.ADMIN;
    const hashedPassword = await bcrypt_1.default.hash(payload.password, 12);
    payload.password = hashedPassword;
    const result = await prisma_1.default.user.create({
        data: payload,
    });
    return result;
};
const getAllUserFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.user, query);
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
            role: client_1.UserRole.USER
        },
        include: {
            education: true,
            socialLinks: true,
            // orders: true
        }
    });
    const meta = await queryBuilder.countTotal();
    return { meta, data: users };
};
const getAllCustomersFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.user, query);
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
    const formattedUsers = users.map((user) => {
        const totalBook = user.orderBook.reduce((sum, ob) => sum + ob.amount, 0);
        const totalCourse = user.orderCourse.reduce((sum, oc) => sum + oc.amount, 0);
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
const getCustomerByIdFromDB = async (id) => {
    let user = null;
    if (!user) {
        user = await prisma_1.default.user.findUnique({
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
    const totalBooks = user.orderBook.reduce((sum, ob) => sum + ob.items.reduce((q, item) => q + item.quantity, 0), 0);
    const totalPurchased = user.orderBook.reduce((sum, ob) => sum + ob.amount, 0) +
        user.orderCourse.reduce((sum, oc) => sum + oc.amount, 0);
    // 🛒 Orders list
    const orders = [
        ...user.orderBook.flatMap((ob) => ob.items.map((item) => ({
            type: "Book",
            title: item.book.bookName,
            price: item.price * item.quantity,
            status: ob.paymentStatus,
            createdAt: ob.createdAt,
        }))),
        ...user.orderCourse.flatMap((oc) => oc.items.map((item) => ({
            type: "Course",
            title: item.course.courseTitle,
            price: item.price * item.quantity,
            status: oc.paymentStatus,
            createdAt: oc.createdAt,
        }))),
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
const getUserByIdFromDB = async (id) => {
    let user = null;
    if (!user) {
        user = await prisma_1.default.user.findUnique({
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
    const totalBooks = user.orderBook.reduce((sum, ob) => sum + ob.items.reduce((q, item) => q + item.quantity, 0), 0);
    const totalPurchased = user.orderBook.reduce((sum, ob) => sum + ob.amount, 0) +
        user.orderCourse.reduce((sum, oc) => sum + oc.amount, 0);
    // 🛒 Orders list
    const orders = [
        ...user.orderBook.flatMap((ob) => ob.items.map((item) => ({
            type: "Book",
            title: item.book.bookName,
            price: item.price * item.quantity,
            status: ob.paymentStatus,
            createdAt: ob.createdAt,
        }))),
        ...user.orderCourse.flatMap((oc) => oc.items.map((item) => ({
            type: "Course",
            title: item.course.courseTitle,
            price: item.price * item.quantity,
            status: oc.paymentStatus,
            createdAt: oc.createdAt,
        }))),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    // 🎯 Response object
    return {
        id: user.id,
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
const getAllAdminFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.user, query);
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
            role: client_1.UserRole.ADMIN
        },
        include: {
            education: true,
            socialLinks: true,
            orders: true
        }
    });
    const meta = await queryBuilder.countTotal();
    return { meta, data: users };
};
const updateProfile = async (payload, user, file) => {
    const userExists = await prisma_1.default.user.findUnique({
        where: {
            id: user.id
        }
    });
    if (!userExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (file) {
        const uploadToCloudinary = await fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.photoUrl = uploadToCloudinary?.secure_url ?? null;
    }
    const result = await prisma_1.default.user.update({
        where: {
            id: user.id
        },
        data: payload
    });
    return result;
};
const updateUserRole = async (id, role) => {
    const userExists = await prisma_1.default.user.findUnique({
        where: {
            id
        }
    });
    if (!userExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const result = await prisma_1.default.user.update({
        where: {
            id
        },
        data: {
            role
        }
    });
    return result;
};
const editAdminSetting = async (id, payload) => {
    const userExists = await prisma_1.default.user.findUnique({
        where: {
            id
        }
    });
    if (!userExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Only include defined properties in the update data
    const updateData = {};
    if (payload.firstName !== undefined)
        updateData.firstName = payload.firstName;
    if (payload.contactNumber !== undefined)
        updateData.contactNumber = payload.contactNumber;
    if (payload.email !== undefined)
        updateData.email = payload.email;
    if (payload.address !== undefined)
        updateData.address = payload.address;
    if (payload.introduction !== undefined)
        updateData.introduction = payload.introduction;
    const result = await prisma_1.default.user.update({
        where: {
            id
        },
        data: updateData
    });
    return result;
};
exports.UserServices = {
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
};
//# sourceMappingURL=user.service.js.map