import { z } from 'zod';

export const createAreaSchema = z.object({
    body: z.object({
        venue_id: z.string().min(1, 'venue_id is required'),
        name: z.string().min(1, 'Name is required'),
        width: z.number().positive('Width must be positive'),
        height: z.number().positive('Height must be positive')
    })
});

export const updateAreaSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        width: z.number().positive().optional(),
        height: z.number().positive().optional()
    })
});