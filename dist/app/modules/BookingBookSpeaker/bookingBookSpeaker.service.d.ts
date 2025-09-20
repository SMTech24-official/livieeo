import { BookingBookSpeaker } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { IGenericResponse } from "../../../interfaces/common";
export declare const BookingBookSpeakerServices: {
    createBookingBookSpeakerIntoDB: (payload: BookingBookSpeaker, user: JwtPayload) => Promise<{
        id: string;
        userId: string;
        firstName: string;
        lastName: string;
        email: string;
        contactNumber: string;
        createdAt: Date;
        updatedAt: Date;
        date: string;
        time: string;
        yourNote: string;
    }>;
    getAllBookingBookSpeakersFromDB: (query: Record<string, unknown>, userId: string) => Promise<IGenericResponse<BookingBookSpeaker[]>>;
};
//# sourceMappingURL=bookingBookSpeaker.service.d.ts.map