import { Router } from 'express';
import { findMany, getOne, updateOne, deleteOne, createOne } from '../controllers/accounts';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth.middleware';
import { createAccountSchema, updateAccountSchema } from '../schemas/account.schema';

const router = Router();

router.post('/', validate(createAccountSchema), createOne);
router.get('/', authenticate, findMany);
router.get('/:id', authenticate, getOne);
router.patch('/:id', authenticate, validate(updateAccountSchema), updateOne);
router.delete('/:id', authenticate, deleteOne);

export default router;