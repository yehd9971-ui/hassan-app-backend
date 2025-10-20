import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';

export const authorize = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // التحقق من وجود المستخدم
    if (!req.user) {
      res.status(401).json({
        success: false,
        code: 'TOKEN_REQUIRED',
        message: 'رمز المصادقة مطلوب'
      });
      return;
    }

    // التحقق من الصلاحيات
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        code: 'INSUFFICIENT_PERMISSIONS',
        message: 'ليس لديك صلاحية للوصول إلى هذا المورد'
      });
      return;
    }

    next();
  };
};
