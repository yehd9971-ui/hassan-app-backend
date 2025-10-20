import { Request } from 'express';

export interface AppJwtPayload {
  id: string;
  role: 'poet' | 'admin' | 'user';
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: AppJwtPayload;
}

export interface AuthErrorResponse {
  success: false;
  code: 'TOKEN_REQUIRED' | 'TOKEN_EXPIRED' | 'TOKEN_INVALID' | 'USER_NOT_FOUND';
  message: string;
}
