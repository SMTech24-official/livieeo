import { User } from '@prisma/client';
declare const prismaWithExtensions: import("@prisma/client/runtime/library").DynamicClientExtensionThis<import("@prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/library").InternalArgs & {
    result: {};
    model: {
        user: {
            isUserExists: () => (email: string) => Promise<Partial<User> | null>;
            isPasswordMatched: () => (givenPassword: string, savedPassword: string) => Promise<boolean>;
        };
    };
    query: {};
    client: {};
}, {}>, import("@prisma/client").Prisma.TypeMapCb<import("@prisma/client").Prisma.PrismaClientOptions>, {
    result: {};
    model: {
        user: {
            isUserExists: () => (email: string) => Promise<Partial<User> | null>;
            isPasswordMatched: () => (givenPassword: string, savedPassword: string) => Promise<boolean>;
        };
    };
    query: {};
    client: {};
}>;
export default prismaWithExtensions;
//# sourceMappingURL=prismaWithExtension.d.ts.map