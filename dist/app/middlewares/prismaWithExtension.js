"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const prismaWithExtensions = prisma_1.default.$extends({
    model: {
        user: {
            async isUserExists(email) {
                // Implement your logic to check if a user with the given ID exists.
                const user = await prisma_1.default.user.findUnique({ where: { email } });
                return user;
            },
            //   async isUserNameExists(username: string): Promise<Partial<User> | null> {
            //     // Implement your logic to check if a user with the given ID exists.
            //     const user = await prisma.user.findUnique({ where: { userName: username } });
            //     return user;
            //   },
            async isPasswordMatched(givenPassword, savedPassword) {
                // Implement your logic to compare passwords using bcrypt.
                return bcrypt_1.default.compare(givenPassword, savedPassword);
            },
        },
    },
});
exports.default = prismaWithExtensions;
//# sourceMappingURL=prismaWithExtension.js.map