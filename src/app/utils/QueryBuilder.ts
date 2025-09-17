/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query } from "mongoose";
import { excludedField } from "../constants";

// Generic QueryBuilder class for all GET methods
export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, any>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, any> = {}) {
    this.modelQuery = modelQuery; // Example: User.find()
    this.query = query || {}; // Safe fallback
  }

  // Filtering
  filter(): this {
    const filter = { ...this.query };

    for (const field of excludedField) {
      if (Object.prototype.hasOwnProperty.call(filter, field)) {
        delete filter[field];
      }
    }

    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }

  // Search (regex based)
  search(searchableFields: string[]): this {
    const searchTerm = this.query?.searchTerm || "";

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
  sort(): this {
    const sort = this.query?.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  // Field limiting
  fields(): this {
    const fields = this.query?.fields
      ? this.query.fields.split(",").join(" ")
      : "";

    if (fields) {
      this.modelQuery = this.modelQuery.select(fields);
    }

    return this;
  }

  // Pagination
  paginate(): this {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // Final query builder
  build() {
    return this.modelQuery;
  }

  // Metadata (for pagination response)
  async getMeta() {
    const totalDocuments = await this.modelQuery.model.countDocuments();
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const totalPage = Math.ceil(totalDocuments / limit);

    return { page, limit, total: totalDocuments, totalPage };
  }
}
