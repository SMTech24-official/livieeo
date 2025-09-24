import { Contact } from "@prisma/client";
export declare const ContactServices: {
    saveContactIntoDB: (payload: Contact) => Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: Date;
        message: string;
        phoneNumber: string;
    }>;
};
//# sourceMappingURL=contact.service.d.ts.map