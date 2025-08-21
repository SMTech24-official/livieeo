import { SocialLinks } from "@prisma/client";
export declare const SocialLinksServices: {
    createSocialLinkIntoDB: (payload: SocialLinks) => Promise<{
        id: string;
        userId: string;
        facebook: string | null;
        twitter: string | null;
        linkedin: string | null;
        instagram: string | null;
    }>;
    updateSocialLinkIntoDB: (id: string, payload: SocialLinks) => Promise<{
        id: string;
        userId: string;
        facebook: string | null;
        twitter: string | null;
        linkedin: string | null;
        instagram: string | null;
    }>;
    deleteSocialLinkFromDB: (id: string) => Promise<{
        id: string;
        userId: string;
        facebook: string | null;
        twitter: string | null;
        linkedin: string | null;
        instagram: string | null;
    }>;
    getSocialLinkByIdFromDB: (id: string) => Promise<{
        id: string;
        userId: string;
        facebook: string | null;
        twitter: string | null;
        linkedin: string | null;
        instagram: string | null;
    } | null>;
    getSocialLinksFromDB: () => Promise<{
        id: string;
        userId: string;
        facebook: string | null;
        twitter: string | null;
        linkedin: string | null;
        instagram: string | null;
    }[]>;
};
//# sourceMappingURL=socialLinks.service.d.ts.map