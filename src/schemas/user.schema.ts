import { z } from 'zod';

export const loginSchema = z.object({
    body: z.object({
        email: z.email('Invalid email'),
        password: z.string().min(6, 'Password must contain minimum 6 characters')
    })
});