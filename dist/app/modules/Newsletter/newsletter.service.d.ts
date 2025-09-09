import { JwtPayload } from "jsonwebtoken";
import { Newsletter } from "@prisma/client";
export declare const NewsletterServices: {
    subscribeNewsletter: (payload: Newsletter, user: JwtPayload) => Promise<{
        id: string;
        email: string;
        createdAt: Date;
    }>;
};
//# sourceMappingURL=newsletter.service.d.ts.map