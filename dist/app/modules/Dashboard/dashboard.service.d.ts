import { ActivityType } from "@prisma/client";
export declare const saveActivity: (userId: string, product: string, type: ActivityType) => Promise<{
    id: string;
    userId: string;
    createdAt: Date;
    product: string;
    type: import("@prisma/client").$Enums.ActivityType;
}>;
export declare const getRecentActivities: () => Promise<{
    name: string;
    product: string;
    type: import("@prisma/client").$Enums.ActivityType;
    timeAgo: Date;
    profileImage: string | null;
}[]>;
export declare const DashboardServices: {
    totalRevenue: () => Promise<number>;
    bookSalesCount: () => Promise<number>;
    courseEnrollments: () => Promise<number>;
    speakingInquires: () => Promise<number>;
    newMemberOfThisMonth: () => Promise<number>;
    webVisitorOfThisMonth: () => Promise<number>;
    getRecentActivities: () => Promise<{
        name: string;
        product: string;
        type: import("@prisma/client").$Enums.ActivityType;
        timeAgo: Date;
        profileImage: string | null;
    }[]>;
    getTopSellingBooks: () => Promise<{
        progress: number;
        bookId: string;
        bookName: string | undefined;
        authorName: string | undefined;
        totalSold: number;
        price: number | undefined;
        cover: string | undefined;
    }[]>;
    getTopSellingCourses: () => Promise<{
        progress: number;
        courseId: string;
        courseTitle: string | undefined;
        mentorName: string | undefined;
        totalSold: number;
        price: number | undefined;
    }[]>;
};
//# sourceMappingURL=dashboard.service.d.ts.map