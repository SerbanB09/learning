import { Router } from 'express';
import { findMany, getOne, updateOne, deleteOne, createOne } from '../controllers/tables';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth.middleware';
import { createTableSchema, updateTableSchema } from '../schemas/table.schema';

const router = Router();

router.use(authenticate);

router.post('/', validate(createTableSchema), createOne);
router.get('/', findMany);
router.get('/:id', getOne);
router.patch('/:id', validate(updateTableSchema), updateOne);
router.delete('/:id', deleteOne);

export default router;