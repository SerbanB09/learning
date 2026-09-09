import { Router } from 'express';
import { findMany, getOne, updateOne, deleteOne, createOne } from '../controllers/table_types';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth.middleware';
import { createTableTypeSchema, updateTableTypeSchema } from '../schemas/table_type.schema';

const router = Router();

router.use(authenticate);

router.post('/', validate(createTableTypeSchema), createOne);
router.get('/', findMany);
router.get('/:id', getOne);
router.patch('/:id', validate(updateTableTypeSchema), updateOne);
router.delete('/:id', deleteOne);

export default router;