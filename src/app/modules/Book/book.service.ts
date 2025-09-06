import { Book } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import { IGenericResponse } from "../../../interfaces/common";
import QueryBuilder from "../../../helpers/queryBuilder";
import ApiError from "../../../errors/ApiError";

const createBookIntoDB = async (payload: Book, book: IFile, bookCover: IFile) => {

    if (book) {
        const uploadBook = await fileUploader.uploadToCloudinary(book);
        payload.book = uploadBook?.secure_url ?? "";
    }
    if (bookCover) {
        const uploadBookCover = await fileUploader.uploadToCloudinary(bookCover);
        payload.bookCover = uploadBookCover?.secure_url ?? "";
    }
    const result = await prisma.book.create({
        data: payload
    });
    return result;
}

const getAllBooksFromDB = async (query: Record<string, any>): Promise<IGenericResponse<Book[]>> => {
    const queryBuilder = new QueryBuilder(prisma.book, query)
    const books = await queryBuilder
        .range()
        .search(["bookName", "authorName", "category", "brand"])
        .filter(["category"])
        .sort()
        .paginate()
        .fields()
        .execute();
    const meta = await queryBuilder.countTotal();
    if (!books || books.length === 0) {
        throw new ApiError(404, "No books found");
    }
    return { meta, data: books };
};


// 📌 Most Popular Books Service
const getMostPopularBooksFromDB = async (
  query: Record<string, any>
): Promise<IGenericResponse<Book[]>> => {
  const queryBuilder = new QueryBuilder(prisma.book, query);

  const books = await queryBuilder
    .range()
    .search(["bookName", "authorName", "category", "brand", "language"])
    .filter(["category"])
    .sort()
    .paginate()
    .fields()
    .execute({
      where: { isPublished: true },
      orderBy: { rating: "desc" }, // ⭐ highest rating আগে আসবে
    });

  const meta = await queryBuilder.countTotal();

  if (!books || books.length === 0) {
    throw new ApiError(404, "No popular books found");
  }

  return { meta, data: books };
};
// 📌 New Books Service
const getNewBooksFromDB = async (
  query: Record<string, any>
): Promise<IGenericResponse<Book[]>> => {
  const queryBuilder = new QueryBuilder(prisma.book, query);

  const books = await queryBuilder
    .range()
    .search(["bookName", "authorName", "category", "brand", "language"])
    .filter(["category", "language", "brand"])
    .sort()
    .paginate()
    .fields()
    .execute({
      where: { isPublished: true },
      orderBy: { publishDate: "desc" }, // ⭐ সর্বশেষ বই আগে আসবে
    });

  const meta = await queryBuilder.countTotal();

  if (!books || books.length === 0) {
    throw new ApiError(404, "No new books found");
  }

  return { meta, data: books };
};
const getPublishedBooksFromDB = async (query: Record<string, any>): Promise<IGenericResponse<Book[]>> => {
    const queryBuilder = new QueryBuilder(prisma.book, query)
    const books = await queryBuilder
        .range()
        .search(["bookName", "authorName", "category", "brand"])
        .filter(["category"])
        .sort()
        .paginate()
        .fields()
        .execute(
            {
                where: {
                    isPublished: true
                }
            }
        );
    const meta = await queryBuilder.countTotal();
    if (!books || books.length === 0) {
        throw new ApiError(404, "No books found");
    }
    return { meta, data: books };
};

const getBookByIdFromDB = async (id: string) => {
    const existbook = await prisma.book.findUnique({ where: { id } });
    if (!existbook) {
        throw new ApiError(404, "Book not found!");
    }
    const result = await prisma.book.findUniqueOrThrow({
        where: {
            id
        }
    });
    return result;
}

const updateBookInDB = async (id: string, payload?: Partial<Book>, book?: IFile, bookCover?: IFile) => {
    // যদি payload undefined বা empty object হয়
    if (!payload || Object.keys(payload).length === 0) {
        throw new ApiError(400, "No data provided to update");
    }

    const existbook = await prisma.book.findUnique({ where: { id } });
    if (!existbook) {
        throw new ApiError(404, "Book not found!");
    }

    // file update handle
    if (book) {
        const uploadBook = await fileUploader.uploadToCloudinary(book);
        payload = { ...payload, book: uploadBook?.secure_url ?? existbook.book };
    }

    if (bookCover) {
        const uploadBookCover = await fileUploader.uploadToCloudinary(bookCover);
        payload = { ...payload, bookCover: uploadBookCover?.secure_url ?? existbook.bookCover };
    }

    // rating validation
    if (payload.rating !== undefined) {
        if (payload.rating < 1 || payload.rating > 5) {
            throw new ApiError(400, "Rating must be between 1 and 5");
        }
    }

    const result = await prisma.book.update({ where: { id }, data: payload });
    return result;
};

const deleteBookFromDB = async (id: string) => {
    return await prisma.$transaction(async (tx) => {
        // 1️⃣ বইটা আছে কিনা চেক করো
        const book = await tx.book.findUnique({
            where: { id },
            include: { orderItems: true },
        });

        if (!book) {
            throw new ApiError(404, "Book not found!");
        }

        // 2️⃣ আগে orderItems ডিলিট করো (যদি থাকে)
        if (book.orderItems.length > 0) {
            await tx.orderBookItem.deleteMany({
                where: { bookId: id },
            });
        }

        // 3️⃣ এবার বই ডিলিট করো
        await tx.book.delete({
            where: { id },
        });

        return { message: "Book and associated order items deleted successfully" };
    });
};
const updatePublishedStatus = async (id: string, status: boolean) => {
    const book = await prisma.book.findUnique({
        where: {
            id
        }
    })
    if (!book) {
        throw new ApiError(404, "Book not found!")
    }
    const result = await prisma.book.update({
        where: { id },
        data: { isPublished: status }
    });
    return result;
}

const getRelatedBooksFromDB = async (
  bookId: string,
  query: Record<string, any>
): Promise<IGenericResponse<Book[]>> => {
  const currentBook = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!currentBook) {
    throw new ApiError(404, "Book not found");
  }
  const queryBuilder = new QueryBuilder(prisma.book, query);

  const books = await queryBuilder
    .range()
    .search(["bookName", "authorName", "category", "brand"])
    .filter(["category"])
    .sort()
    .paginate()
    .fields()
    .execute({
      where: {
        category: currentBook.category,
        id: { not: bookId },
        isPublished: true,
      },
    });

  const meta = await queryBuilder.countTotal();

  if (!books || books.length === 0) {
    throw new ApiError(404, "No related books found");
  }

  return { meta, data: books };
};
const ratingToBook = async (bookId: string, rating: number) => {
    // 1️⃣ rating validate করা
    if (rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5");
    }

    // 2️⃣ বই খুঁজে বের করা
    const book = await prisma.book.findUnique({
        where: {
            id: bookId
        }
    });

    if (!book) {
        throw new ApiError(404, "Book not found!");
    }

    // 3️⃣ rating update করা
    const result = await prisma.book.update({
        where: { id: bookId },
        data: { rating }
    });

    return result;
};

export const BookServices = {
    createBookIntoDB,
    getAllBooksFromDB,
    getPublishedBooksFromDB,
    getBookByIdFromDB,
    updateBookInDB,
    deleteBookFromDB,
    updatePublishedStatus,
    getRelatedBooksFromDB,
    ratingToBook,
    getMostPopularBooksFromDB,
    getNewBooksFromDB
};
