import { FindOptions, WhereOptions } from 'sequelize';

export class QueryBuilder {
  private options: FindOptions = {};

  where(conditions: WhereOptions): this {
    this.options.where = { ...this.options.where, ...conditions };
    return this;
  }

  include(include: FindOptions['include']): this {
    this.options.include = include;
    return this;
  }

  order(order: FindOptions['order']): this {
    this.options.order = order;
    return this;
  }

  limit(limit: number): this {
    this.options.limit = limit;
    return this;
  }

  offset(offset: number): this {
    this.options.offset = offset;
    return this;
  }

  build(): FindOptions {
    return this.options;
  }
}
