"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const constants_1 = require("../constants");
// Generic QueryBuilder class for all GET methods
class QueryBuilder {
    constructor(modelQuery, query = {}) {
        this.modelQuery = modelQuery; // Example: User.find()
        this.query = query || {}; // Safe fallback
    }
    // Filtering
    filter() {
        const filter = Object.assign({}, this.query);
        for (const field of constants_1.excludedField) {
            if (Object.prototype.hasOwnProperty.call(filter, field)) {
                delete filter[field];
            }
        }
        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }
    // Search (regex based)
    search(searchableFields) {
        var _a;
        const searchTerm = ((_a = this.query) === null || _a === void 0 ? void 0 : _a.searchTerm) || "";
        if (searchTerm) {
            const searchQuery = {
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: "i" },
                })),
            };
            this.modelQuery = this.modelQuery.find(searchQuery);
        }
        return this;
    }
    // Sorting
    sort() {
        var _a;
        const sort = ((_a = this.query) === null || _a === void 0 ? void 0 : _a.sort) || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    // Field limiting
    fields() {
        var _a;
        const fields = ((_a = this.query) === null || _a === void 0 ? void 0 : _a.fields)
            ? this.query.fields.split(",").join(" ")
            : "";
        if (fields) {
            this.modelQuery = this.modelQuery.select(fields);
        }
        return this;
    }
    // Pagination
    paginate() {
        var _a, _b;
        const page = Number((_a = this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = Number((_b = this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    // Final query builder
    build() {
        return this.modelQuery;
    }
    // Metadata (for pagination response)
    getMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const totalDocuments = yield this.modelQuery.model.countDocuments();
            const page = Number((_a = this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
            const limit = Number((_b = this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
            const totalPage = Math.ceil(totalDocuments / limit);
            return { page, limit, total: totalDocuments, totalPage };
        });
    }
}
exports.QueryBuilder = QueryBuilder;
