import { z } from 'zod';

export const createTableSchema = z.object({
    body: z.object({
        area_id: z.string().min(1, 'area_id is required'),
        table_type_id: z.string().min(1, 'table_type_id is required'),
        name: z.string().min(1, 'Name is required'),
        seat_count: z.number().int().positive('seat_count must be a positive integer'),
        position_x: z.number(),
        position_y: z.number()
    })
});

export const updateTableSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        seat_count: z.number().int().positive().optional(),
        position_x: z.number().optional(),
        position_y: z.number().optional()
    })
});