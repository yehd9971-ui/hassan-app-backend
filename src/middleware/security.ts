import helmet from 'helmet';
import cors from 'cors';

// إعدادات Helmet للأمان
export const helmetConfig = helmet({
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xDnsPrefetchControl: { allow: false },
  hidePoweredBy: true,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});

// إعدادات CORS
export const corsConfig = cors({
  origin: ['http://localhost:4000', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
});
