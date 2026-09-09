import { Router } from 'express';
import { findMany, getOne, deleteOne, createOne, updateOne, login } from '../controllers/users';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../schemas/user.schema';
import { authenticate } from '../middlewares/auth.middleware'

const router = Router();

// Public routes
router.post('/login', validate(loginSchema), login);
router.post('/', createOne);

// Protected routes
router.get('/', authenticate, findMany);
router.get('/:id', authenticate, getOne);
router.put('/:id', authenticate, updateOne);
router.delete('/:id', authenticate, deleteOne);

export default router;