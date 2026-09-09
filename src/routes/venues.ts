import { Router } from 'express';
import { findMany, getOne, updateOne, deleteOne, createOne } from '../controllers/venues';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth.middleware';
import { createVenueSchema, updateVenueSchema } from '../schemas/venue.schema';

const router = Router();

router.use(authenticate);

router.post('/', validate(createVenueSchema), createOne);
router.get('/', findMany);
router.get('/:id', getOne);
router.patch('/:id', validate(updateVenueSchema), updateOne);
router.delete('/:id', deleteOne);

export default router;