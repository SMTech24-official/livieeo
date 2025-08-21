"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/User/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const courseModuleVideo_route_1 = require("../modules/CourseModuleVideo/courseModuleVideo.route");
const courseModule_route_1 = require("../modules/CourseModule/courseModule.route");
const course_route_1 = require("../modules/Course/course.route");
const courseCertificate_route_1 = require("../modules/CourseCertificate/courseCertificate.route");
const book_route_1 = require("../modules/Book/book.route");
const blog_route_1 = require("../modules/Blog/blog.route");
const podcast_route_1 = require("../modules/Podcast/podcast.route");
const education_route_1 = require("../modules/Education/education.route");
const socialLinks_route_1 = require("../modules/SocialLinks/socialLinks.route");
const bookSpeaker_route_1 = require("../modules/BookSpeaker/bookSpeaker.route");
const contact_route_1 = require("../modules/Contact/contact.route");
const bookingBookSpeaker_route_1 = require("../modules/BookingBookSpeaker/bookingBookSpeaker.route");
const speakingSample_route_1 = require("../modules/SpeakingSample/speakingSample.route");
const orderBook_route_1 = require("../modules/OrderBook/orderBook.route");
const orderCourse_route_1 = require("../modules/OrderCourse/orderCourse.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/education",
        route: education_route_1.EducationRoutes,
    },
    {
        path: "/social-links",
        route: socialLinks_route_1.SocialLinksRoutes,
    },
    {
        path: "/course-module-video",
        route: courseModuleVideo_route_1.CourseModuleVideoRoutes,
    },
    {
        path: "/course-module",
        route: courseModule_route_1.CourseModuleRoutes,
    },
    {
        path: "/course",
        route: course_route_1.CourseRoutes,
    },
    {
        path: "/course-certificate",
        route: courseCertificate_route_1.CourseCertificateRoutes,
    },
    {
        path: "/book",
        route: book_route_1.BookRoutes,
    },
    {
        path: "/blog",
        route: blog_route_1.BlogRoutes,
    },
    {
        path: "/podcast",
        route: podcast_route_1.PodcastRoutes,
    },
    {
        path: "/book-speaker",
        route: bookSpeaker_route_1.BookSpeakerRoutes,
    },
    {
        path: "/contact",
        route: contact_route_1.ContactRoutes,
    },
    {
        path: "/booking-book-speaker",
        route: bookingBookSpeaker_route_1.BookingBookSpeakerRoutes,
    },
    {
        path: "/speaking-sample",
        route: speakingSample_route_1.SpeakingSampleRoutes,
    },
    {
        path: "/order-book",
        route: orderBook_route_1.OrderBookRoutes,
    },
    {
        path: "/order-course",
        route: orderCourse_route_1.OrderCourseRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
//# sourceMappingURL=index.js.map