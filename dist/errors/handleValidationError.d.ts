import { Prisma } from "@prisma/client";
import { IGenericErrorResponse } from "../interfaces/common";
declare const handleValidationError: (error: Prisma.PrismaClientValidationError) => IGenericErrorResponse;
export default handleValidationError;
//# sourceMappingURL=handleValidationError.d.ts.map