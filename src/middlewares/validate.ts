import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          data: null,
          meta: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body or parameters',
            details: (error as any).errors.map((e: any) => ({
              field: e.path.join('.'),
              message: e.message
            }))
          }
        });
      }
      next(error);
    }
  };
};
