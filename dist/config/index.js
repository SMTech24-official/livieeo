"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    base_url: process.env.BASE_URL,
    bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt: {
        access_secret: process.env.ACCESS_SECRET,
        access_expires_in: process.env.ACCESS_EXPIRES_IN,
        refresh_secret: process.env.REFRESH_SECRET,
        refresh_expires_in: process.env.REFRESH_EXPIRES_IN,
        reset_pass_secret: process.env.RESET_PASS_SECRET,
        reset_pass_expires_in: process.env.RESET_PASS_EXPIRES_IN,
    },
    reset_pass_link: process.env.RESET_PASS_LINK,
    emailSender: {
        email: process.env.EMAIL,
        app_pass: process.env.APP_PASS,
    },
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    stripe: {
        secret_key: process.env.STRIPE_SECRET_KEY,
        webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
        success_url: process.env.STRIPE_SUCCESS_URL,
        fail_url: process.env.STRIPE_FAIL_URL,
    },
    google: {
        api_key: process.env.GOOGLE_MAP_API_KEY,
    },
    oauth: {
        google: {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
        },
        apple: {
            client_id: process.env.APPLE_CLIENT_ID,
            team_id: process.env.APPLE_TEAM_ID,
            key_id: process.env.APPLE_KEY_ID,
            private_key: process.env.APPLE_PRIVATE_KEY,
            callback_url: process.env.APPLE_CALLBACK_URL,
        },
        facebook: {
            client_id: process.env.FACEBOOK_CLIENT_ID,
            client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        },
        github: {
            client_id: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
        twitter: {
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            client_secret: process.env.TWITTER_CONSUMER_SECRET,
        },
        linkedin: {
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        },
    },
};
//# sourceMappingURL=index.js.map