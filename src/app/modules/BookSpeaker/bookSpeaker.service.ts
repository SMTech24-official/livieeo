import { BookSpeaker, Prisma } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import QueryBuilder from "../../../helpers/queryBuilder";
import { IGenericResponse } from "../../../interfaces/common";
import ApiError from "../../../errors/ApiError";

const createBookSpeakerIntoDB = async (payload: Prisma.BookSpeakerCreateInput, file: IFile) => {
  const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);

  const result = await prisma.bookSpeaker.create({
    data: {
      ...payload,
      imageUrl: uploadToCloudinary?.secure_url ?? "",
    },
  });

  return result;
};

const getAllBookSpeakerFromDB = async (query: Record<string, any>): Promise<IGenericResponse<BookSpeaker[]>> => {
    const queryBuilder = new QueryBuilder(prisma.bookSpeaker, query)
    const bookSpeakers = await queryBuilder
        .range()
        .search(["name", "profession", "expertise"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute();
    const meta = await queryBuilder.countTotal();
    return { meta, data: bookSpeakers }
}

const getBookSpeakerByIdFromDB = async (speakerId: string) => {
    const result = await prisma.bookSpeaker.findUniqueOrThrow({
        where: {
            id: speakerId
        }
    })
    return result
}
const updateBookSpeakerIntoDB = async (speakerId: string, payload: Partial<BookSpeaker>) => {
    const bookSpeaker = await prisma.bookSpeaker.findUnique({
        where: {
            id: speakerId
        }
    })
    if (!bookSpeaker) {
        throw new ApiError(404, "Book speaker not found")
    }
    const result = await prisma.bookSpeaker.update({
        where: {
            id: speakerId
        },
        data: payload
    })
    return result
}
const deleteBookSpeakerFromDB = async (speakerId: string) => {
    const bookSpeaker = await prisma.bookSpeaker.findUnique({
        where: {
            id: speakerId
        }
    })
    if (!bookSpeaker) {
        throw new ApiError(404, "Book speaker not found")
    }
    await prisma.bookSpeaker.delete({
        where: {
            id: speakerId
        }
    })
    return { message: "Book speaker deleted successfully"}
}
export const BookSpeakerServices = {
    createBookSpeakerIntoDB,
    getAllBookSpeakerFromDB,
    getBookSpeakerByIdFromDB,
    updateBookSpeakerIntoDB,
    deleteBookSpeakerFromDB
}