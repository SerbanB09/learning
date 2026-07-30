import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { AppError } from '../errors/AppError';

export const validate = (schema: ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error: any) {
            if (error instanceof ZodError) {
                const formattedMessage = error.issues
                    .map((e) => `${e.path.join('.')}: ${e.message}`)
                    .join(', ');

                return next(new AppError(formattedMessage, 400));
            }

            return next(error);
        }
    };
};