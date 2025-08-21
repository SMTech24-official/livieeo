type IOptions = {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
};
type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
};
export declare const paginationHelpers: {
    calculatePagination: (options: IOptions) => IOptionsResult;
};
export {};
//# sourceMappingURL=paginationHelper.d.ts.map