import { Router } from 'express';
import { findMany, getOne, deleteOne, createOne, updateOne, login } from '../controllers/users';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth.middleware';
import { loginSchema, createUserSchema, updateUserSchema } from '../schemas/user.schema';

const router = Router();

// Public routes
router.post('/login', validate(loginSchema), login);
router.post('/', validate(createUserSchema), createOne);

// Protected routes
router.get('/', authenticate, findMany);
router.get('/:id', authenticate, getOne);
router.put('/:id', authenticate, validate(updateUserSchema), updateOne);
router.delete('/:id', authenticate, deleteOne);

export default router;