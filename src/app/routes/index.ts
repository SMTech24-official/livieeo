import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { CourseModuleVideoRoutes } from "../modules/CourseModuleVideo/courseModuleVideo.route";
import { CourseModuleRoutes } from "../modules/CourseModule/courseModule.route";
import { CourseRoutes } from "../modules/Course/course.route";
import { CourseCertificateRoutes } from "../modules/CourseCertificate/courseCertificate.route";
import { BookRoutes } from "../modules/Book/book.route";
import { BlogRoutes } from "../modules/Blog/blog.route";
import { PodcastRoutes } from "../modules/Podcast/podcast.route";
import { EducationRoutes } from "../modules/Education/education.route";
import { SocialLinksRoutes } from "../modules/SocialLinks/socialLinks.route";
import { BookSpeakerRoutes } from "../modules/BookSpeaker/bookSpeaker.route";
import { ContactRoutes } from "../modules/Contact/contact.route";
import { BookingBookSpeakerRoutes } from "../modules/BookingBookSpeaker/bookingBookSpeaker.route";
import { SpeakingSampleRoutes } from "../modules/SpeakingSample/speakingSample.route";
import { OrderBookRoutes } from "../modules/OrderBook/orderBook.route";
import { OrderCourseRoutes } from "../modules/OrderCourse/orderCourse.route";
import { DashboardRoutes } from "../modules/Dashboard/dashboard.route";
import { CourseProgressRoutes } from "../modules/CourseProgress/courseProgress.route";
import { NewsletterRoutes } from "../modules/Newsletter/newsletter.route";
import { SubscriptionRoutes } from "../modules/Subscription/subscription.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/education",
    route: EducationRoutes,
  },
  {
    path: "/social-links",
    route: SocialLinksRoutes,
  },
  {
    path: "/course-module-video",
    route: CourseModuleVideoRoutes,
  },
  {
    path: "/course-module",
    route: CourseModuleRoutes,
  },
  {
    path: "/course",
    route: CourseRoutes,
  },
  {
    path: "/course-progress",
    route: CourseProgressRoutes,
  },
  {
    path: "/course-certificate",
    route: CourseCertificateRoutes,
  },
  {
    path: "/book",
    route: BookRoutes,
  },
  {
    path: "/blog",
    route: BlogRoutes,
  },
  {
    path: "/podcast",
    route: PodcastRoutes,
  },
  {
    path: "/book-speaker",
    route: BookSpeakerRoutes,
  },
  {
    path: "/contact",
    route: ContactRoutes,
  },
  {
    path: "/newsletter",
    route: NewsletterRoutes,
  },
  {
    path: "/booking-book-speaker",
    route: BookingBookSpeakerRoutes,
  },
  {
    path: "/speaking-sample",
    route: SpeakingSampleRoutes,
  },
  {
    path: "/order-book",
    route: OrderBookRoutes,
  },
  {
    path: "/order-course",
    route: OrderCourseRoutes,
  },
  {
    path: "/dashboard",
    route: DashboardRoutes,
  },
  {
    path: "/subscription",
    route: SubscriptionRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;