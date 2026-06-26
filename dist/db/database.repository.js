"use strict";
// base repository
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRepository = void 0;
class DatabaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async findOne({ filter, select, options }) {
        const doc = this.model.findOne(filter).select(select || "");
        if (options?.populate) {
            doc.populate(options.populate);
        }
        return await doc.exec();
    }
    async findById({ id, select, options }) {
        const doc = this.model.findById(id).select(select || "");
        if (options?.populate) {
            doc.populate(options.populate);
        }
        return await doc.exec();
    }
    async create({ data, options }) {
        return await this.model.create(data, options);
    }
    async updateOne({ filter, update, options }) {
        return await this.model.updateOne(filter, { ...update, $inc: { __v: 1 } }, options);
    }
    async insertMany({ data, }) {
        return await this.model.create(data);
    }
    async find({ filter, select, options }) {
        const doc = this.model.find(filter).select(select || "");
        if (options?.populate) {
            doc.populate(options.populate);
        }
        if (options?.skip)
            doc.skip(options.skip);
        if (options?.limit)
            doc.skip(options.limit);
        return await doc.exec();
    }
    async findOneAndUpdate({ filter, update, options = { new: true } }) {
        if (Array.isArray(update)) {
            update.push({ $set: { _v: { $add: ["$_v", 1] } } });
            return await this.model.findOneAndUpdate(filter, update, { ...options });
        }
        return await this.model.findOneAndUpdate(filter, update, {
            ...options,
            $inc: { _v: 1 }
        });
    }
}
exports.DatabaseRepository = DatabaseRepository;
