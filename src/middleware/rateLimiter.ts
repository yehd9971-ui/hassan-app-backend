import rateLimit from 'express-rate-limit';
import { createClient } from 'redis';

// إنشاء عميل Redis
let redisClient: any = null;

// تهيئة Redis إذا كان متوفراً
export const initRateLimiterStore = async (): Promise<any> => {
  if (process.env.REDIS_URL) {
    try {
      redisClient = createClient({ url: process.env.REDIS_URL });
      await redisClient.connect();
      console.log('✅ تم الاتصال بـ Redis بنجاح');
      return redisClient;
    } catch (error) {
      console.warn('⚠️ فشل الاتصال بـ Redis، سيتم استخدام in-memory store:', error);
      return null;
    }
  }
  return null;
};

// إغلاق اتصال Redis
export const closeRateLimiterStore = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    console.log('🔌 تم إغلاق اتصال Redis');
  }
};

// محدود معدل للقراءة (GET requests)
export const readRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 120, // 120 طلب لكل 15 دقيقة
  message: {
    success: false,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// محدود معدل للكتابة (POST/PUT/DELETE requests)
export const writeRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 20, // 20 طلب لكل 15 دقيقة
  message: {
    success: false,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// محدود معدل للمصادقة
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 50, // 50 محاولة لكل 15 دقيقة (زيادة بـ 10 مرات)
  message: {
    success: false,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'تم تجاوز الحد المسموح من محاولات تسجيل الدخول، يرجى المحاولة لاحقاً'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
