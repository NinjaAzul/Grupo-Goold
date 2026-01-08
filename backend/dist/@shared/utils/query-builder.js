"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
class QueryBuilder {
    constructor() {
        this.options = {};
    }
    where(conditions) {
        this.options.where = { ...this.options.where, ...conditions };
        return this;
    }
    include(include) {
        this.options.include = include;
        return this;
    }
    order(order) {
        this.options.order = order;
        return this;
    }
    limit(limit) {
        this.options.limit = limit;
        return this;
    }
    offset(offset) {
        this.options.offset = offset;
        return this;
    }
    build() {
        return this.options;
    }
}
exports.QueryBuilder = QueryBuilder;
//# sourceMappingURL=query-builder.js.map