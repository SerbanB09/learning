import { z } from 'zod';

export const createBookingSchema = z.object({
    body: z.object({
        table_id: z.string().min(1, 'table_id is required'),
        venue_id: z.string().min(1, 'venue_id is required'),
        person_count: z.number().int().positive('person_count must be a positive integer'),
        date: z.iso.datetime('date must be a valid ISO datetime string'),
        note: z.string().optional()
    })
});

export const updateBookingSchema = z.object({
    body: z.object({
        person_count: z.number().int().positive().optional(),
        date: z.iso.datetime('date must be a valid ISO datetime string').optional(),
        note: z.string().optional()
    })
});