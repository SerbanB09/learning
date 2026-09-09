import { z } from 'zod';

export const createAccountSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required')
    })
});

export const updateAccountSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required').optional()
    })
});