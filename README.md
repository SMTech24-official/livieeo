# Livieeo API

Livieeo is a Node.js RESTful API built with Express and TypeScript, using Prisma ORM and MongoDB. It provides endpoints for user management, authentication, books, courses, blogs, podcasts, education, social links, book speakers, contacts, bookings, speaking samples, orders, and more.

## Features

- User registration, admin creation, and authentication (JWT)
- Book management (CRUD, publish, rating)
- Course management (CRUD, modules, certificates)
- Blog and podcast management
- Education and social links
- Book speaker and booking management
- Speaking sample uploads
- Stripe payment integration for orders
- Webhook support
- File uploads via Cloudinary

## Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB
- Cloudinary account
- Stripe account

### Installation

```sh
git clone <your-repo-url>
cd livieeo
npm install
```

### Environment Variables

Create a `.env` file in the root directory. Example:

```
PORT=5000
NODE_ENV=development
ACCESS_SECRET=your_jwt_access_secret
REFRESH_SECRET=your_jwt_refresh_secret
EMAIL=your_email@gmail.com
APP_PASS=your_email_app_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_SUCCESS_URL=https://yourdomain.com/success
STRIPE_FAIL_URL=https://yourdomain.com/fail
```

### Build & Run

```sh
npm run build
npm start
# For development:
npm run dev
```

## API Endpoints

Base URL: `/api/v1`

### Auth

- `POST /auth/login` - Login
- `POST /auth/refresh-token` - Refresh JWT
- `POST /auth/change-password` - Change password
- `POST /auth/forgot-password` - Send OTP
- `POST /auth/reset-password` - Reset password

### User

- `POST /user/register` - Register user (with file upload)
- `POST /user/create-admin` - Create admin (with file upload)
- `GET /user` - Get all users
- `GET /user/customers` - Get all customers
- `GET /user/:userId` - Get user by ID
- `PUT /user/update-profile` - Update user profile
- `PATCH /user/update-role/:id` - Update user profile

### Book

- `POST /book/create` - Create book (upload book & cover)
- `GET /book` - Get all books
- `GET /book/published-books` - Get published books
- `GET /book/:id` - Get book by ID
- `PATCH /book/:id` - Update book
- `DELETE /book/:id` - Delete book
- `PATCH /book/:id/published-status` - Update published status
- `PATCH /book/rating/:bookId` - Rate a book

### Course

- `POST /course/create` - Create course
- `GET /course` - Get all courses
- `GET /course/published-courses` - Get published courses
- `PATCH /course/:courseId/published-status` - Update published status

### Course Module & Video

- `POST /course-module/create` - Create course module
- `GET /course-module` - Get all modules
- `GET /course-module/:id` - Get module by ID
- `POST /course-module-video/create` - Create module video (upload video)
- `GET /course-module-video` - Get all videos
- `GET /course-module-video/:id` - Get video by ID

### Course Certificate

- `POST /course-certificate/issue` - Create certificate (upload file)
- `GET /course-certificate/verify` - Verify certificates

### Blog

- `POST /blog/create` - Create blog (upload images)
- `GET /blog` - Get all blogs
- `GET /blog/published-blogs` - Get published blogs
- `PATCH /blog/:id` - Update blog
- `DELETE /blog/:id` - Delete blog
- `PATCH /blog/published-status/:id` - Update published status

### Podcast

- `POST /podcast/create` - Create podcast (upload files)
- `GET /podcast` - Get all podcasts
- `GET /podcast/published-podcast` - Get published podcasts
- `PATCH /podcast/:id` - Update podcast
- `DELETE /podcast/:id` - Delete podcast
- `PATCH /podcast/podcast-status/:id` - Update podcast status
- `POST /podcast/log-play/:podcastId` - Hit route when user play podcast
- `POST /podcast/log-play/:podcastId` - Hit route when user play podcast
- `GET /podcast/my-recent-podcasts` -   GET my-recent-podcasts

router.post("/log-play/:podcastId",auth(UserRole.ADMIN,UserRole.USER), PodcastControllers.logPodcastPlay);
router.get("/activities", PodcastControllers.getActivities);
router.get("/my-recent-podcasts",auth(UserRole.ADMIN,UserRole.USER), PodcastControllers.getMyRecentPodcasts);

### Education

- `POST /education/create` - Create education
- `PATCH /education/:id` - Update education
- `DELETE /education/:id` - Delete education
- `GET /education/:id` - Get education by ID
- `GET /education` - Get all educations

### Social Links

- `POST /social-links/create` - Create social link
- `PATCH /social-links/:id` - Update social link
- `DELETE /social-links/:id` - Delete social link
- `GET /social-links/:id` - Get social link by ID
- `GET /social-links` - Get all social links

### Book Speaker

- `POST /book-speaker/create-book-speaker` - Create book speaker (upload file)
- `GET /book-speaker` - Get all book speakers
- `GET /book-speaker/:speakerId` - Get speaker by ID
- `PUT /book-speaker/:speakerId` - Update speaker
- `DELETE /book-speaker/:speakerId` - Delete speaker

### Booking Book Speaker

- `POST /booking-book-speaker/create` - Book a speaker

### Speaking Sample

- `POST /speaking-sample/create` - Create speaking sample (upload video)
- `GET /speaking-sample` - Get all samples
- `GET /speaking-sample/:speakingSampleId` - Get sample by ID
- `PATCH /speaking-sample/:speakingSampleId` - Update sample
- `DELETE /speaking-sample/:speakingSampleId` - Delete sample

### Orders

- `POST /order-book/create` - Create book order (Stripe payment)
- `GET /order-book` - Get all book orders
- `GET /order-book/my-books` - Get my ordered books
- `POST /order-course/create` - Create course order (Stripe payment)
- `GET /order-course` - Get all course orders
- `GET /order-course/my-courses` - Get my ordered courses

### Contact

- `POST /contact` - Save contact (auth required)

### Webhook

- `POST /webhook/stripe` - Stripe webhook endpoint

### Dashboard

- `GET /dashboard/total-revenue` - Get total revenue
- `GET /dashboard/book-sales-count` - Get book sales count
- `GET /dashboard/course-enrollments` - Get course enrollments count
- `GET /dashboard/speaking-inquiries` - Get speaking-inquiries
- `GET /dashboard/new-members-this-month` - Get new-members-this-month
- `GET /dashboard/web-visitors-this-month` - Get web-visitors-this-month
- `GET /dashboard/recent-activities` - Get recent-activities
- `GET /dashboard/top-selling-books` - Get top-selling-books
- `GET /dashboard/top-selling-courses` - Get top-selling-courses


## File Uploads

- Uses Multer for file uploads
- Images and videos are uploaded to Cloudinary

## Error Handling

- Centralized error handler ([src/app/middlewares/globalErrorHandler.ts](src/app/middlewares/globalErrorHandler.ts))
- Custom error class ([src/errors/ApiError.ts](src/errors/ApiError.ts))

## Logging

- Visitor logging middleware ([src/app/middlewares/visitorLogger.ts](src/app/middlewares/visitorLogger.ts))

## License

MIT

---

For more details, see the source code in the [src](src) directory.