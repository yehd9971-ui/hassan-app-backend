import { Response, NextFunction } from 'express';
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError, NotBeforeError } from 'jsonwebtoken';
import { AuthenticatedRequest, AuthErrorResponse } from '../types/auth';
import { getJwtSecret } from '../config/jwt';

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    // البحث عن التوكن في Authorization header
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // البحث عن التوكن في الكوكي (اختياري)
    if (!token && req.cookies?.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      const errorResponse: AuthErrorResponse = {
        success: false,
        code: 'TOKEN_REQUIRED',
        message: 'رمز المصادقة مطلوب'
      };
      res.status(401).json(errorResponse);
      return;
    }

    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, getJwtSecret(), { 
      algorithms: ['HS256'],
      clockTolerance: 60 // 60 seconds tolerance for clock differences
    }) as JwtPayload;
    
    // التحقق من أن التوكن يحتوي على البيانات المطلوبة
    if (typeof decoded !== 'object' || !('id' in decoded) || !('role' in decoded)) {
      const errorResponse: AuthErrorResponse = {
        success: false,
        code: 'TOKEN_INVALID',
        message: 'رمز المصادقة غير صالح'
      };
      res.status(401).json(errorResponse);
      return;
    }

    // إضافة بيانات المستخدم إلى الطلب
    req.user = {
      id: decoded.id,
      role: decoded.role as 'poet' | 'admin' | 'user'
    };

    next();
  } catch (error) {
    let errorResponse: AuthErrorResponse;

    if (error instanceof TokenExpiredError) {
      errorResponse = {
        success: false,
        code: 'TOKEN_EXPIRED',
        message: 'انتهت صلاحية الجلسة، يرجى إعادة تسجيل الدخول'
      };
    } else if (error instanceof JsonWebTokenError || error instanceof NotBeforeError) {
      errorResponse = {
        success: false,
        code: 'TOKEN_INVALID',
        message: 'رمز المصادقة غير صالح'
      };
    } else {
      errorResponse = {
        success: false,
        code: 'TOKEN_INVALID',
        message: 'رمز المصادقة غير صالح'
      };
    }

    res.status(401).json(errorResponse);
  }
};
