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
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;