import { bookingRepository } from '../repositories/bookings.repository.js';
import { serviceRepository } from '../repositories/services.repository.js';

export const bookingService = {
    getAll:  () => bookingRepository.getAll(),
    getById: (id) => bookingRepository.getById(id),
    create:  (data) => bookingRepository.create(data),
    update:  (id, data) => bookingRepository.update(id, data),
    remove:  (id) => bookingRepository.remove(id),

    async addService(bookingId, serviceId, quantity = 1) {
        await serviceRepository.getById(serviceId);

        const booking = await bookingRepository.getById(bookingId);

        // Compara como string para soportar ObjectId populado o sin popularfar
        const existing = booking.services.find(
            (s) => String(s.service?._id ?? s.service) === String(serviceId)
        );

        if (existing) {
            return bookingRepository.updateServiceQuantity(
                bookingId,
                serviceId,
                existing.quantity + quantity
            );
        }

        return bookingRepository.addService(bookingId, serviceId, quantity);
    },

    removeService: (bookingId, serviceId) =>
        bookingRepository.removeService(bookingId, serviceId),

    clearServices: (bookingId) =>
        bookingRepository.clearServices(bookingId),
};
