import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const isAppError = err instanceof AppError;
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = isAppError ? err.message : 'Internal server error';

    if (!isAppError) {
        console.error('UNHANDLED ERROR: ', err);
    }

    res.status(statusCode).json({
        status: 'error',
        message
    });
};