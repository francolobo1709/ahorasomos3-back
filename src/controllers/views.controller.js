import { serviceService } from '../services/services.service.js';
import { bookingService } from '../services/bookings.service.js';

export const renderServices = async (req, res, next) => {
    try {
        const result = await serviceService.getAll({});
        res.render('services', { services: result.data ?? [] });
    } catch (err) {
        next(err);
    }
};

export const renderAvailability = async (req, res, next) => {
    try {
        const bookings = await bookingService.getAll();
        res.render('availability', { bookings: Array.isArray(bookings) ? bookings : [] });
    } catch (err) {
        next(err);
    }
};