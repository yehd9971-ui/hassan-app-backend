// رسائل الأخطاء الموحدة
export const ERROR_MESSAGES = {
  // أخطاء عامة
  INTERNAL_SERVER_ERROR: 'خطأ داخلي في الخادم',
  VALIDATION_ERROR: 'خطأ في التحقق من البيانات',
  RATE_LIMIT_EXCEEDED: 'تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً',
  UNAUTHORIZED: 'غير مصرح لك بالوصول',
  FORBIDDEN: 'ممنوع الوصول',
  NOT_FOUND: 'المورد غير موجود',
  
  // أخطاء القصائد
  POEM_NOT_FOUND: 'القصيدة غير موجودة',
  POEM_CREATE_FAILED: 'فشل في إنشاء القصيدة',
  POEM_UPDATE_FAILED: 'فشل في تحديث القصيدة',
  POEM_DELETE_FAILED: 'فشل في حذف القصيدة',
  POEM_FETCH_FAILED: 'فشل في جلب القصائد',
  
  // أخطاء التحقق
  INVALID_METER: 'البحر غير صالح',
  INVALID_POEM_TYPE: 'نوع القصيدة غير صالح',
  INVALID_SORT: 'قيمة الترتيب غير صالحة',
  INVALID_DATE: 'تاريخ غير صالح',
  INVALID_ID: 'معرف غير صالح',
  
  // أخطاء الإحصائيات
  STATS_FETCH_FAILED: 'فشل في جلب الإحصائيات',
  STATS_OVERVIEW_FAILED: 'فشل في جلب الإحصائيات الشاملة',
  STATS_METER_FAILED: 'فشل في جلب إحصائيات البحر',
  STATS_TYPE_FAILED: 'فشل في جلب إحصائيات النوع',
  
  // أخطاء البحث
  SEARCH_FAILED: 'فشل في البحث',
  SEARCH_QUERY_REQUIRED: 'كلمة البحث مطلوبة',
  
  // أخطاء المصادقة
  LOGIN_FAILED: 'فشل في تسجيل الدخول',
  LOGOUT_FAILED: 'فشل في تسجيل الخروج',
  TOKEN_INVALID: 'التوكن غير صالح',
  TOKEN_EXPIRED: 'انتهت صلاحية التوكن',
  NO_TOKEN: 'الرجاء تسجيل الدخول أولاً',
  
  // أخطاء قاعدة البيانات
  DATABASE_CONNECTION_FAILED: 'فشل في الاتصال بقاعدة البيانات',
  DATABASE_QUERY_FAILED: 'فشل في تنفيذ استعلام قاعدة البيانات',
  
  // أخطاء الكاش
  CACHE_FAILED: 'فشل في الوصول للكاش',
  CACHE_INVALIDATION_FAILED: 'فشل في إبطال الكاش'
} as const;

// أكواد الأخطاء
export const ERROR_CODES = {
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  POEM_NOT_FOUND: 'POEM_NOT_FOUND',
  POEM_CREATE_FAILED: 'POEM_CREATE_FAILED',
  POEM_UPDATE_FAILED: 'POEM_UPDATE_FAILED',
  POEM_DELETE_FAILED: 'POEM_DELETE_FAILED',
  POEM_FETCH_FAILED: 'POEM_FETCH_FAILED',
  INVALID_METER: 'INVALID_METER',
  INVALID_POEM_TYPE: 'INVALID_POEM_TYPE',
  INVALID_SORT: 'INVALID_SORT',
  INVALID_DATE: 'INVALID_DATE',
  INVALID_ID: 'INVALID_ID',
  STATS_FETCH_FAILED: 'STATS_FETCH_FAILED',
  STATS_OVERVIEW_FAILED: 'STATS_OVERVIEW_FAILED',
  STATS_METER_FAILED: 'STATS_METER_FAILED',
  STATS_TYPE_FAILED: 'STATS_TYPE_FAILED',
  SEARCH_FAILED: 'SEARCH_FAILED',
  SEARCH_QUERY_REQUIRED: 'SEARCH_QUERY_REQUIRED',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT_FAILED: 'LOGOUT_FAILED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  NO_TOKEN: 'NO_TOKEN',
  DATABASE_CONNECTION_FAILED: 'DATABASE_CONNECTION_FAILED',
  DATABASE_QUERY_FAILED: 'DATABASE_QUERY_FAILED',
  CACHE_FAILED: 'CACHE_FAILED',
  CACHE_INVALIDATION_FAILED: 'CACHE_INVALIDATION_FAILED'
} as const;

// دالة مساعدة لإنشاء استجابة خطأ موحدة
export function createErrorResponse(
  message: string,
  code: string,
  statusCode: number = 500,
  details?: any
): any {
  return {
    success: false,
    message,
    code,
    statusCode,
    timestamp: new Date().toISOString(),
    ...(details && { details })
  };
}

// دالة مساعدة لإنشاء استجابة نجاح موحدة
export function createSuccessResponse(
  message: string,
  data?: any,
  statusCode: number = 200,
  meta?: any
): any {
  return {
    success: true,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    ...(data && { data }),
    ...(meta && { meta })
  };
}
