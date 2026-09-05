import { BookingModel } from '../models/Booking.model.js';

export class BookingDAO {
    async findAll() {
        return BookingModel.find().populate('services.service').lean();
    }

    async findById(id) {
        return BookingModel.findById(id).populate('services.service').lean();
    }

    async create(data) {
        const doc = new BookingModel(data);
        const saved = await doc.save();
        return saved.populate('services.service');
    }

    async updateById(id, data) {
        return BookingModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
            .populate('services.service')
            .lean();
    }

    async deleteById(id) {
        return BookingModel.findByIdAndDelete(id).lean();
    }

    async addService(bookingId, serviceId, quantity = 1) {
        return BookingModel.findByIdAndUpdate(
            bookingId,
            { $push: { services: { service: serviceId, quantity } } },
            { new: true }
        ).populate('services.service').lean();
    }

    async updateServiceQuantity(bookingId, serviceId, quantity) {
        return BookingModel.findOneAndUpdate(
            { _id: bookingId, 'services.service': serviceId },
            { $set: { 'services.$.quantity': quantity } },
            { new: true }
        ).populate('services.service').lean();
    }

    async removeService(bookingId, serviceId) {
        return BookingModel.findByIdAndUpdate(
            bookingId,
            { $pull: { services: { service: serviceId } } },
            { new: true }
        ).populate('services.service').lean();
    }

    async clearServices(bookingId) {
        return BookingModel.findByIdAndUpdate(
            bookingId,
            { $set: { services: [] } },
            { new: true }
        ).lean();
    }
}
