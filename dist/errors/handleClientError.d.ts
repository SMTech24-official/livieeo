import { Prisma } from "@prisma/client";
import { IGenericErrorMessage } from "../interfaces/error";
declare const handleClientError: (error: Prisma.PrismaClientKnownRequestError) => {
    statusCode: number;
    message: string;
    errorMessages: IGenericErrorMessage[];
};
export default handleClientError;
//# sourceMappingURL=handleClientError.d.ts.map