import { ServiceModel } from '../models/Service.model.js';

export class ServiceDAO {
    async findAll({ filter = {}, sort = {}, page = 1, limit = 10 } = {}) {
        const query = {};
        if (filter.category !== undefined) query.category = filter.category;
        if (filter.available !== undefined) query.available = filter.available;

        const total = await ServiceModel.countDocuments(query);
        const skip  = (page - 1) * limit;
        const docs  = await ServiceModel.find(query).sort(sort).skip(skip).limit(limit).lean();

        return { docs, total };
    }

    async findById(id) {
        return ServiceModel.findById(id).lean();
    }

    async create(data) {
        const doc = new ServiceModel(data);
        return (await doc.save()).toObject();
    }

    async updateById(id, data) {
        return ServiceModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    }

    async deleteById(id) {
        return ServiceModel.findByIdAndDelete(id).lean();
    }
}
