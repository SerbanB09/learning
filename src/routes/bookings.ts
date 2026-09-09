import { Router } from 'express';
import { findMany, getOne, updateOne, deleteOne, createOne } from '../controllers/bookings';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth.middleware';
import { createBookingSchema, updateBookingSchema } from '../schemas/booking.schema';

const router = Router();

router.use(authenticate);

router.post('/', validate(createBookingSchema), createOne);
router.get('/', findMany);
router.get('/:id', getOne);
router.patch('/:id', validate(updateBookingSchema), updateOne);
router.delete('/:id', deleteOne);

export default router;