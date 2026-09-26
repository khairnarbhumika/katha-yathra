import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface ParsableSchema {
  parse: (data: unknown) => any;
}

export const validateBody = (schema: ParsableSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.errors) {
        return res.status(400).json({
          error: 'Validation failed',
          details: (error.errors || []).map((err: any) => ({
            field: err.path?.join('.') || 'body',
            message: err.message || 'Invalid value'
          }))
        });
      }
      return res.status(400).json({ error: error?.message || 'Invalid request data' });
    }
  };
};
