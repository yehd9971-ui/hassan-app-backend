# ميزات الأمان المضافة لتطبيق قصائد الشاعر محمود حسان

## الميزات المطبقة

### 1. مصادقة JWT محسنة
- **الملف**: `src/middleware/authenticate.ts`
- **الميزات**:
  - Type-safety مع `AppJwtPayload`
  - تمييز أخطاء JWT المختلفة (منتهي، تالف، مفقود)
  - دعم Bearer token و cookies
  - رسائل خطأ موحدة باللغة العربية

### 2. نظام التفويض
- **الملف**: `src/middleware/authorize.ts`
- **الميزات**:
  - تفويض بناءً على الأدوار (poet, admin, user)
  - رسائل خطأ موحدة (401 للغياب، 403 للصلاحيات)

### 3. تحديد معدل الطلبات
- **الملف**: `src/middleware/rateLimiter.ts`
- **الميزات**:
  - دعم Redis مع fallback إلى in-memory
  - سياسات مختلفة:
    - المصادقة: 5 طلبات/15 دقيقة
    - الكتابة: 20 طلب/دقيقة
    - القراءة: 120 طلب/دقيقة

### 4. التحقق من البيانات
- **الملف**: `src/schemas/poemSchemas.ts`
- **الميزات**:
  - مخططات Zod للقصائد
  - التحقق من إنشاء وتحديث القصائد
  - دعم pagination والبحث

### 5. الأمان العام
- **الملفات**: `src/middleware/security.ts`, `src/middleware/sanitize.ts`
- **الميزات**:
  - Helmet للأمان
  - CORS محدود
  - حماية من حقن MongoDB
  - تنظيف انتقائي (لا يؤثر على نصوص القصائد)

### 6. حماية المسارات
- **الملف**: `src/routes/poems.ts`
- **الميزات**:
  - مسارات القراءة: عامة
  - مسارات الكتابة: محمية بـ authenticate + authorize
  - Rate limiting لكل نوع طلب

## كيفية الاستخدام

### 1. تثبيت التبعيات
```bash
npm install
```

### 2. إعداد متغيرات البيئة
انسخ `env.example` إلى `.env` وحدث القيم:
```env
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379  # اختياري
FRONTEND_URL=http://localhost:3000
```

### 3. تسجيل الدخول
```bash
POST /hassan-app/login
{
  "username": "poet",
  "password": "password"
}
```

### 4. استخدام API
```bash
# جلب القصائد (عام)
GET /poems

# إنشاء قصيدة (محمية)
POST /poems
Authorization: Bearer <token>
{
  "title": "عنوان القصيدة",
  "text": "نص القصيدة",
  "verses": ["البيت الأول", "البيت الثاني"],
  "poemType": "عمودي",
  "tags": ["حب", "شعر"]
}

# تحديث قصيدة (محمية)
PUT /poems/:id
Authorization: Bearer <token>
{
  "title": "عنوان جديد"
}
```

## رسائل الأخطاء الموحدة

جميع الأخطاء تتبع نفس التنسيق:
```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "رسالة الخطأ بالعربية"
}
```

### أكواد الأخطاء:
- `TOKEN_REQUIRED`: رمز المصادقة مطلوب
- `TOKEN_EXPIRED`: انتهت صلاحية الجلسة
- `TOKEN_INVALID`: رمز المصادقة غير صالح
- `INSUFFICIENT_PERMISSIONS`: صلاحيات غير كافية
- `VALIDATION_ERROR`: خطأ في التحقق من البيانات
- `RATE_LIMIT_EXCEEDED`: تجاوز حد الطلبات
- `NOT_FOUND`: المورد غير موجود

## الأمان المطبق

1. **حماية من حقن MongoDB**: تنظيف تلقائي للاستعلامات
2. **Rate Limiting**: منع هجمات DDoS
3. **JWT Security**: تشفير آمن للجلسات
4. **CORS**: حماية من الطلبات غير المصرح بها
5. **Helmet**: رؤوس أمان إضافية
6. **Input Validation**: التحقق من جميع المدخلات
7. **Type Safety**: حماية من أخطاء البرمجة

## ملاحظات مهمة

- نصوص القصائد لا يتم تنظيفها لتجنب إتلاف المحتوى
- Redis اختياري، النظام يعمل بدون Redis
- جميع الرسائل باللغة العربية
- النظام يدعم pagination للبحث في القصائد
- يمكن إضافة وسوم للقصائد للتصنيف
