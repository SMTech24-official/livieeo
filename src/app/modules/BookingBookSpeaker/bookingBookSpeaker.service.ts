import { BookingBookSpeaker } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status"
import { IGenericResponse } from "../../../interfaces/common";
import QueryBuilder from "../../../helpers/queryBuilder";

const createBookingBookSpeakerIntoDB = async (payload: BookingBookSpeaker, user: JwtPayload) => {
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "user not found")
    }
    payload.userId = user.id
    const result = await prisma.bookingBookSpeaker.create({ data: payload })
    return result
}


const getAllBookingBookSpeakersFromDB = async (
  query: Record<string, unknown>,
  userId: string
): Promise<IGenericResponse<BookingBookSpeaker[]>> => {
  const queryBuilder = new QueryBuilder(prisma.bookingBookSpeaker, query);

  const bookings = await queryBuilder
    .search(["date", "time"])
    .filter(["date", "time"])
    .sort()
    .paginate()
    .fields()
    .execute({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });

  const meta = await queryBuilder.countTotal();
  return { meta, data: bookings };
};

export const BookingBookSpeakerServices = {
    createBookingBookSpeakerIntoDB,
    getAllBookingBookSpeakersFromDB
}