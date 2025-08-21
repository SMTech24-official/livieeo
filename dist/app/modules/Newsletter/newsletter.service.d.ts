import { JwtPayload } from "jsonwebtoken";
export declare const NewsletterServices: {
    subscribeNewsletter: (user: JwtPayload) => Promise<{
        id: string;
        email: string;
        createdAt: Date;
    }>;
};
//# sourceMappingURL=newsletter.service.d.ts.map