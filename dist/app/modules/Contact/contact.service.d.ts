import { Contact } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
export declare const ContactServices: {
    saveContactIntoDB: (payload: Contact, user: JwtPayload) => Promise<{
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