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

// محدود معدل للقراءة (GET requests) - محسّن 4x
export const readRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 480, // 480 طلب لكل 15 دقيقة (32 طلب/دقيقة)
  message: {
    success: false,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// محدود معدل للكتابة (POST/PUT/DELETE requests) - محسّن 4x
export const writeRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 80, // 80 طلب لكل 15 دقيقة (5.3 طلب/دقيقة)
  message: {
    success: false,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// محدود معدل للمصادقة - محسّن 4x
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 200, // 200 محاولة لكل 15 دقيقة (13.3 محاولة/دقيقة)
  message: {
    success: false,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'تم تجاوز الحد المسموح من محاولات تسجيل الدخول، يرجى المحاولة لاحقاً'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// محدود معدل للإحصائيات - محسّن
export const statsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 120, // 120 طلب لكل 15 دقيقة (8 طلب/دقيقة)
  message: {
    success: false,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'تم تجاوز الحد المسموح من طلبات الإحصائيات، يرجى المحاولة لاحقاً'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
