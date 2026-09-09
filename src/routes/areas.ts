import { Router } from 'express';
import { findMany, getOne, updateOne, deleteOne, createOne } from '../controllers/areas';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth.middleware';
import { createAreaSchema, updateAreaSchema } from '../schemas/area.schema';

const router = Router();

router.use(authenticate);

router.post('/', validate(createAreaSchema), createOne);
router.get('/', findMany);
router.get('/:id', getOne);
router.patch('/:id', validate(updateAreaSchema), updateOne);
router.delete('/:id', deleteOne);

export default router;