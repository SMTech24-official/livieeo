import { ActivityType, PaymentStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";

const totalRevenue = async()=> {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const bookRevenue = await prisma.orderBook.aggregate({
        _sum: {
            amount: true
        },
        where: {
            createdAt: {
                gte: startOfMonth,
                lte: endOfMonth
            },
            paymentStatus: PaymentStatus.PAID
        }
    })
    const courseRevenue = await prisma.orderCourse.aggregate({
        _sum: {
            amount: true
        },
        where: {
            createdAt: {
                gte: startOfMonth,
                lte: endOfMonth
            },
            paymentStatus: PaymentStatus.PAID
        }
    })
    return (bookRevenue._sum.amount || 0) + (courseRevenue._sum.amount || 0);
}

const bookSalesCount = async()=> {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const bookSales = await prisma.orderBook.count({
        where: {
            createdAt: {
                gte: startOfMonth,
                lte: endOfMonth
            },
            paymentStatus: PaymentStatus.PAID
        }
    })
    return bookSales;
}

const courseEnrollments = async()=> {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const courseEnrollments = await prisma.orderCourse.count({
        where: {
            createdAt: {
                gte: startOfMonth,
                lte: endOfMonth
            },
            paymentStatus: PaymentStatus.PAID
        }
    })
    return courseEnrollments;
}

const speakingInquires = async()=> {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const inquiries = await prisma.bookingBookSpeaker.count({
        where: {
            createdAt: {
                gte: startOfMonth,
                lte: endOfMonth
            }
        }
    })
    return inquiries;
}

const newMemberOfThisMonth = async()=> {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const newMembers = await prisma.user.count({
        where: {
            createdAt: {
                gte: startOfMonth,
                lte: endOfMonth
            }
        }
    })
    return newMembers;
}

const webVisitorOfThisMonth = async()=> {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const visitors = await prisma.webVisitor.count({
        where: {
            createdAt: {
                gte: startOfMonth,
                lte: endOfMonth
            }
        }
    })
    return visitors;
}


export const saveActivity = async (
  userId: string,
  product: string,
  type: ActivityType
) => {
  const activity = await prisma.activity.create({
    data: {
      userId,
      product,
      type, // এখন ঠিক আছে
    },
  });
  return activity;
};

export const getRecentActivities = async () => {
  const activities = await prisma.activity.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5, // শুধু সর্বশেষ ৫টা দেখাবো
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          photoUrl: true
        },
      },
    },
  });

  return activities.map(act => ({
    name: `${act.user.firstName} ${act.user.lastName}`,
    product: act.product,
    type: act.type,
    timeAgo: act.createdAt, // UI তে আপনি "1 min ago" এ কনভার্ট করবেন
    profileImage: act.user.photoUrl
  }));
};


// Top Selling Books
const getTopSellingBooks = async () => {
  const result = await prisma.orderBookItem.groupBy({
    by: ["bookId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  // book details join করতে হবে
  const books = await Promise.all(
    result.map(async (item) => {
      const book = await prisma.book.findUnique({
        where: { id: item.bookId },
      });
      return {
        bookId: item.bookId,
        bookName: book?.bookName,
        authorName: book?.authorName,
        totalSold: item._sum.quantity || 0,
        price: book?.price,
        cover: book?.bookCover,
      };
    })
  );

  return books;
};


// Top Selling Courses
const getTopSellingCourses = async () => {
  const result = await prisma.orderCourseItem.groupBy({
    by: ["courseId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  const courses = await Promise.all(
    result.map(async (item) => {
      const course = await prisma.course.findUnique({
        where: { id: item.courseId },
      });
      return {
        courseId: item.courseId,
        courseTitle: course?.courseTitle,
        mentorName: course?.mentorName,
        totalSold: item._sum.quantity || 0,
        price: course?.price,
      };
    })
  );

  return courses;
};

export const DashboardServices = {
    totalRevenue,
    bookSalesCount,
    courseEnrollments,
    speakingInquires,
    newMemberOfThisMonth,
    webVisitorOfThisMonth,
    getRecentActivities,
    getTopSellingBooks,
    getTopSellingCourses
}