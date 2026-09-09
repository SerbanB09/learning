import { z } from 'zod';

export const createVenueSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        address: z.string().min(1, 'Address is required')
    })
});

export const updateVenueSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        address: z.string().min(1).optional()
    })
});