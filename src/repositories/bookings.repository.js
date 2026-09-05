import { BookingDAO } from '../dao/bookings.dao.js';
import { NotFoundError } from '../errors/AppError.js';
import { assertValidId } from './repository.utils.js';

const dao = new BookingDAO();

export const bookingRepository = {
    async getAll() {
        return dao.findAll();
    },

    async getById(id) {
        assertValidId(id);
        const booking = await dao.findById(id);
        if (!booking) throw new NotFoundError(id, 'Reserva');
        return booking;
    },

    async create(data) {
        return dao.create(data);
    },

    async update(id, data) {
        assertValidId(id);
        const updated = await dao.updateById(id, data);
        if (!updated) throw new NotFoundError(id, 'Reserva');
        return updated;
    },

    async remove(id) {
        assertValidId(id);
        const deleted = await dao.deleteById(id);
        if (!deleted) throw new NotFoundError(id, 'Reserva');
        return deleted;
    },

    async addService(bookingId, serviceId, quantity = 1) {
        assertValidId(bookingId);
        assertValidId(serviceId);
        const updated = await dao.addService(bookingId, serviceId, quantity);
        if (!updated) throw new NotFoundError(bookingId, 'Reserva');
        return updated;
    },

    async updateServiceQuantity(bookingId, serviceId, quantity) {
        assertValidId(bookingId);
        assertValidId(serviceId);
        const updated = await dao.updateServiceQuantity(bookingId, serviceId, quantity);
        if (!updated) throw new NotFoundError(bookingId, 'Reserva');
        return updated;
    },

    async removeService(bookingId, serviceId) {
        assertValidId(bookingId);
        assertValidId(serviceId);
        const updated = await dao.removeService(bookingId, serviceId);
        if (!updated) throw new NotFoundError(bookingId, 'Reserva');
        return updated;
    },

    async clearServices(bookingId) {
        assertValidId(bookingId);
        const updated = await dao.clearServices(bookingId);
        if (!updated) throw new NotFoundError(bookingId, 'Reserva');
        return updated;
    },
};
