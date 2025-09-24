import { Newsletter } from "@prisma/client";
export declare const NewsletterServices: {
    subscribeNewsletter: (payload: Newsletter) => Promise<{
        id: string;
        email: string;
        createdAt: Date;
    }>;
};
//# sourceMappingURL=newsletter.service.d.ts.map