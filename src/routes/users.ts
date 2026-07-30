// src/routes/users.ts
import { Router } from 'express';
import { findMany, getOne, deleteOne, createOne, updateOne, login } from '../controllers/users';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../schemas/user.schema';

const router = Router();

// Rute publice
router.post('/login', validate(loginSchema), login);
router.post('/', createOne);

// Rute care vor fi protejate (ex: cu autentificare/validare)
router.get('/', findMany);
router.get('/:id', getOne);
router.put('/:id', updateOne);
router.delete('/:id', deleteOne);

export default router;