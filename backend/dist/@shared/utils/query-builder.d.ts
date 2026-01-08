import { FindOptions, WhereOptions } from 'sequelize';
export declare class QueryBuilder {
    private options;
    where(conditions: WhereOptions): this;
    include(include: FindOptions['include']): this;
    order(order: FindOptions['order']): this;
    limit(limit: number): this;
    offset(offset: number): this;
    build(): FindOptions;
}
//# sourceMappingURL=query-builder.d.ts.map