import { BookingBookSpeaker } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createBookingBookSpeakerIntoDB = async(payload: BookingBookSpeaker)=> {
    const result = await prisma.bookingBookSpeaker.create({data: payload})
    return result
}

// const getAll


export const BookingBookSpeakerServices = {
    createBookingBookSpeakerIntoDB
}