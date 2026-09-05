import { bookingService } from '../services/bookings.service.js';
import { getIO } from '../config/socket.js';

export const getBookings = async (req, res, next) => {
    try {
        res.json(await bookingService.getAll());
    } catch (err) {
        next(err);
    }
};

export const getBookingById = async (req, res, next) => {
    try {
        res.json(await bookingService.getById(req.params.bid));
    } catch (err) {
        next(err);
    }
};

export const createBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.create(req.body);
        try { getIO().emit('booking:created', booking); } catch (_) {}
        res.status(201).json(booking);
    } catch (err) {
        next(err);
    }
};

export const updateBooking = async (req, res, next) => {
    try {
        res.json(await bookingService.update(req.params.bid, req.body));
    } catch (err) {
        next(err);
    }
};

export const deleteBooking = async (req, res, next) => {
    try {
        res.json(await bookingService.remove(req.params.bid));
    } catch (err) {
        next(err);
    }
};

// POST /api/bookings/:bid/services/:sid
export const addServiceToBooking = async (req, res, next) => {
    try {
        const { bid, sid } = req.params;
        const quantity = req.body?.quantity ?? 1;
        res.json(await bookingService.addService(bid, sid, quantity));
    } catch (err) {
        next(err);
    }
};

// DELETE /api/bookings/:bid/services/:sid
export const removeServiceFromBooking = async (req, res, next) => {
    try {
        res.json(await bookingService.removeService(req.params.bid, req.params.sid));
    } catch (err) {
        next(err);
    }
};

// DELETE /api/bookings/:bid/services
export const clearBookingServices = async (req, res, next) => {
    try {
        res.json(await bookingService.clearServices(req.params.bid));
    } catch (err) {
        next(err);
    }
};
