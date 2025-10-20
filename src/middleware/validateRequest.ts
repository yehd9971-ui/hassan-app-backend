import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // التحقق من البيانات في body
      if (req.body && Object.keys(req.body).length > 0) {
        req.body = schema.parse(req.body);
      }
      
      // التحقق من البيانات في query
      if (req.query && Object.keys(req.query).length > 0) {
        req.query = schema.parse(req.query);
      }
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        res.status(400).json({
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'بيانات غير صحيحة',
          errors: errorMessages
        });
        return;
      }
      
      res.status(400).json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'خطأ في التحقق من البيانات'
      });
    }
  };
};
