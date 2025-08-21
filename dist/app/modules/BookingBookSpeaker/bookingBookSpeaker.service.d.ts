import { BookingBookSpeaker } from "@prisma/client";
export declare const BookingBookSpeakerServices: {
    createBookingBookSpeakerIntoDB: (payload: BookingBookSpeaker) => Promise<{
        id: string;
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
};
//# sourceMappingURL=bookingBookSpeaker.service.d.ts.map