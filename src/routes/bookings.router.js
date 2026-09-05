import { Router } from 'express';
import * as bookingsController from '../controllers/bookings.controller.js';
import { validate } from '../middlewares/validate.js';
import { createBookingSchema, addServiceToBookingSchema } from '../validators/booking.validators.js';

const router = Router();

router.get('/',       bookingsController.getBookings);
router.get('/:bid',   bookingsController.getBookingById);
router.post('/',      validate(createBookingSchema), bookingsController.createBooking);
router.put('/:bid',   bookingsController.updateBooking);
router.delete('/:bid', bookingsController.deleteBooking);

// Gestión de servicios dentro de una reserva
router.post('/:bid/services/:sid',   validate(addServiceToBookingSchema), bookingsController.addServiceToBooking);
router.delete('/:bid/services/:sid', bookingsController.removeServiceFromBooking);
router.delete('/:bid/services',      bookingsController.clearBookingServices);

export default router;

