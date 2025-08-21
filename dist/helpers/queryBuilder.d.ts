declare class QueryBuilder {
    private model;
    private query;
    private prismaQuery;
    constructor(model: any, query: Record<string, unknown>);
    search(searchableFields: string[]): this;
    filter(exactFields?: string[]): this;
    rawFilter(filters: Record<string, any>): this;
    sort(): this;
    paginate(): this;
    fields(): this;
    include(includableFields: Record<string, boolean | object>): this;
    populate(relations: Record<string, boolean | object>): this;
    range(): this;
    execute(extraOptions?: Record<string, any>): Promise<any>;
    countTotal(): Promise<{
        page: number;
        limit: number;
        total: any;
        totalPage: number;
    }>;
}
export default QueryBuilder;
//# sourceMappingURL=queryBuilder.d.ts.map