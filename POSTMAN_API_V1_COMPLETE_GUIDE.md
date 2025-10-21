# 🚀 Hassan App API v1 - دليل Postman الشامل

## 📋 نظرة عامة
هذا الدليل يحتوي على جميع أوامر API v1 للتطبيق مع تعليمات مفصلة لاستخدام Postman.

---

## 🔧 إعداد Postman

### 1. متغيرات البيئة
أنشئ Environment جديد في Postman وأضف المتغيرات التالية:

```
BASE_URL: https://your-railway-app.railway.app
API_VERSION: v1
JWT_TOKEN: (سيتم ملؤه تلقائياً بعد تسجيل الدخول)
```

### 2. Headers الافتراضية
أضف هذه Headers لجميع الطلبات:

```
Content-Type: application/json
Accept: application/json
```

---

## 🏠 المسارات الأساسية

### 1. الصفحة الرئيسية
```http
GET {{BASE_URL}}/
```

**الاستجابة المتوقعة:**
```json
{
  "message": "مرحباً! خادم Node.js مع Express و TypeScript يعمل بنجاح",
  "status": "success",
  "timestamp": "2025-10-21T01:27:03.962Z"
}
```

### 2. فحص الصحة
```http
GET {{BASE_URL}}/health
```

**الاستجابة المتوقعة:**
```
OK
```

### 3. فحص الصحة المفصل
```http
GET {{BASE_URL}}/health/detailed
```

**الاستجابة المتوقعة:**
```json
{
  "status": "OK",
  "uptime": 123.456,
  "database": "Connected",
  "timestamp": "2025-10-21T01:27:03.962Z"
}
```

---

## 🏢 Hassan App Routes

### 1. معلومات التطبيق
```http
GET {{BASE_URL}}/hassan-app
```

### 2. معلومات مفصلة
```http
GET {{BASE_URL}}/hassan-app/info
```

### 3. فحص صحة التطبيق
```http
GET {{BASE_URL}}/hassan-app/health
```

---

## 🔐 نظام المصادقة

### 1. تسجيل الدخول
```http
POST {{BASE_URL}}/hassan-app/login
Content-Type: application/json

{
  "username": "admin@example.com",
  "password": "your_password"
}
```

**الاستجابة المتوقعة:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "role": "admin",
      "username": "admin@example.com",
      "name": "Admin User"
    }
  }
}
```

**⚠️ مهم:** احفظ الـ `token` في متغير `JWT_TOKEN` في Postman.

### 2. تسجيل الخروج
```http
POST {{BASE_URL}}/hassan-app/logout
```

### 3. التحقق من صحة التوكن
```http
GET {{BASE_URL}}/hassan-app/verify-token
Authorization: Bearer {{JWT_TOKEN}}
```

---

## 📚 API v1 - إدارة القصائد

### 1. إنشاء قصيدة جديدة
```http
POST {{BASE_URL}}/api/v1/poems
Authorization: Bearer {{JWT_TOKEN}}
Content-Type: application/json

{
  "title": "قصيدة الحب",
  "text": "في قلبي حب لا ينتهي\nوفي عيني شوق لا يهدأ",
  "verses": [
    "في قلبي حب لا ينتهي",
    "وفي عيني شوق لا يهدأ"
  ],
  "poemType": "عمودي",
  "meter": "بحر الكامل",
  "rhyme": "أ",
  "published": true,
  "tags": ["حب", "شوق", "شعر"]
}
```

**الاستجابة المتوقعة:**
```json
{
  "success": true,
  "message": "تم إنشاء القصيدة بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "قصيدة الحب",
    "text": "في قلبي حب لا ينتهي\nوفي عيني شوق لا يهدأ",
    "verses": [
      "في قلبي حب لا ينتهي",
      "وفي عيني شوق لا يهدأ"
    ],
    "poemType": "عمودي",
    "meter": "بحر الكامل",
    "rhyme": "أ",
    "published": true,
    "tags": ["حب", "شوق", "شعر"],
    "createdAt": "2025-10-21T01:27:03.962Z",
    "updatedAt": "2025-10-21T01:27:03.962Z"
  }
}
```

### 2. جلب جميع القصائد
```http
GET {{BASE_URL}}/api/v1/poems?page=1&limit=10&sort=new&published=true
```

**معاملات الاستعلام:**
- `page`: رقم الصفحة (افتراضي: 1)
- `limit`: عدد القصائد في الصفحة (1-100، افتراضي: 20)
- `sort`: ترتيب النتائج (`new` أو `old`، افتراضي: `new`)
- `published`: عرض المنشور فقط (`true` أو `false`)
- `type`: نوع القصيدة (`عمودي`, `حر`, `نثر`, `شعبي`)
- `tag`: البحث بالوسم
- `q`: البحث في النص

**الاستجابة المتوقعة:**
```json
{
  "success": true,
  "message": "تم جلب القصائد بنجاح",
  "data": {
    "poems": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "قصيدة الحب",
        "text": "في قلبي حب لا ينتهي...",
        "poemType": "عمودي",
        "published": true,
        "createdAt": "2025-10-21T01:27:03.962Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalPoems": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 3. البحث في القصائد
```http
GET {{BASE_URL}}/api/v1/poems/search?q=حب&type=عمودي&published=true
```

**معاملات البحث:**
- `q`: كلمة البحث (مطلوبة)
- `type`: نوع القصيدة (اختياري)
- `published`: عرض المنشور فقط (اختياري)

### 4. جلب قصيدة بالمعرف
```http
GET {{BASE_URL}}/api/v1/poems/507f1f77bcf86cd799439011
```

**الاستجابة المتوقعة:**
```json
{
  "success": true,
  "message": "تم جلب القصيدة بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "قصيدة الحب",
    "text": "في قلبي حب لا ينتهي\nوفي عيني شوق لا يهدأ",
    "verses": [
      "في قلبي حب لا ينتهي",
      "وفي عيني شوق لا يهدأ"
    ],
    "poemType": "عمودي",
    "meter": "بحر الكامل",
    "rhyme": "أ",
    "published": true,
    "tags": ["حب", "شوق", "شعر"],
    "createdAt": "2025-10-21T01:27:03.962Z",
    "updatedAt": "2025-10-21T01:27:03.962Z"
  }
}
```

### 5. تحديث قصيدة
```http
PUT {{BASE_URL}}/api/v1/poems/507f1f77bcf86cd799439011
Authorization: Bearer {{JWT_TOKEN}}
Content-Type: application/json

{
  "title": "قصيدة الحب المحدثة",
  "published": false,
  "tags": ["حب", "شوق", "شعر", "تحديث"]
}
```

**الاستجابة المتوقعة:**
```json
{
  "success": true,
  "message": "تم تحديث القصيدة بنجاح",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "قصيدة الحب المحدثة",
    "text": "في قلبي حب لا ينتهي...",
    "published": false,
    "tags": ["حب", "شوق", "شعر", "تحديث"],
    "updatedAt": "2025-10-21T01:27:03.962Z"
  }
}
```

### 6. حذف قصيدة
```http
DELETE {{BASE_URL}}/api/v1/poems/507f1f77bcf86cd799439011
Authorization: Bearer {{JWT_TOKEN}}
```

**الاستجابة المتوقعة:**
```json
{
  "success": true,
  "message": "تم حذف القصيدة بنجاح"
}
```

---

## 🔒 الصلاحيات المطلوبة

### المسارات العامة (لا تحتاج مصادقة):
- `GET /`
- `GET /health`
- `GET /health/detailed`
- `GET /hassan-app`
- `GET /hassan-app/info`
- `GET /hassan-app/health`
- `GET /api/v1/poems` (جلب القصائد)
- `GET /api/v1/poems/search` (البحث)
- `GET /api/v1/poems/:id` (جلب قصيدة واحدة)

### المسارات المحمية (تحتاج مصادقة):
- `POST /hassan-app/login`
- `POST /hassan-app/logout`
- `GET /hassan-app/verify-token`
- `POST /api/v1/poems` (إنشاء قصيدة)
- `PUT /api/v1/poems/:id` (تحديث قصيدة)
- `DELETE /api/v1/poems/:id` (حذف قصيدة)

**الأدوار المطلوبة:**
- `poet`: يمكن إنشاء وتحديث وحذف القصائد
- `admin`: جميع الصلاحيات

---

## ⚡ حدود المعدل (Rate Limiting)

### حدود القراءة:
- **100 طلب في الدقيقة** للمسارات العامة

### حدود الكتابة:
- **20 طلب في الدقيقة** للمسارات المحمية

### حدود المصادقة:
- **10 محاولات في الدقيقة** لتسجيل الدخول

---

## 🚨 رموز الأخطاء

| الكود | المعنى | الحل |
|-------|--------|------|
| `400` | Bad Request | تحقق من صحة البيانات المرسلة |
| `401` | Unauthorized | تأكد من وجود التوكن الصحيح |
| `403` | Forbidden | ليس لديك صلاحية للوصول |
| `404` | Not Found | المسار أو المورد غير موجود |
| `429` | Too Many Requests | تجاوزت حد الطلبات المسموح |
| `500` | Internal Server Error | خطأ في الخادم |

---

## 📝 أمثلة على الاستخدام

### 1. سيناريو كامل - إنشاء قصيدة
```bash
# 1. تسجيل الدخول
POST /hassan-app/login
{
  "username": "admin@example.com",
  "password": "password123"
}

# 2. حفظ التوكن في متغير JWT_TOKEN

# 3. إنشاء قصيدة
POST /api/v1/poems
Authorization: Bearer {{JWT_TOKEN}}
{
  "title": "قصيدة جديدة",
  "text": "نص القصيدة هنا",
  "verses": ["البيت الأول", "البيت الثاني"],
  "poemType": "عمودي",
  "published": true
}

# 4. جلب القصيدة
GET /api/v1/poems/{{poem_id}}
```

### 2. البحث والتصفية
```bash
# البحث في القصائد
GET /api/v1/poems/search?q=حب&type=عمودي

# جلب القصائد المنشورة فقط
GET /api/v1/poems?published=true&sort=old

# البحث بالوسم
GET /api/v1/poems?tag=شوق&limit=5
```

---

## 🔧 نصائح Postman

### 1. إعداد Collection
- أنشئ Collection جديد باسم "Hassan App API v1"
- قسم المسارات إلى مجلدات:
  - `Auth` (المصادقة)
  - `Poems` (القصائد)
  - `Health` (فحص الصحة)

### 2. استخدام Tests Scripts
```javascript
// في Tests tab لمسار تسجيل الدخول
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.data.token) {
        pm.environment.set("JWT_TOKEN", response.data.token);
    }
}
```

### 3. إعداد Pre-request Scripts
```javascript
// إضافة التوكن تلقائياً للمسارات المحمية
const token = pm.environment.get("JWT_TOKEN");
if (token) {
    pm.request.headers.add({
        key: "Authorization",
        value: `Bearer ${token}`
    });
}
```

---

## 📊 مراقبة الأداء

### 1. فحص استجابة الخادم
```http
GET {{BASE_URL}}/health/detailed
```

### 2. مراقبة الذاكرة
```json
{
  "status": "OK",
  "uptime": 3600,
  "database": "Connected",
  "memory": {
    "rss": 45678912,
    "heapTotal": 20971520,
    "heapUsed": 15728640,
    "external": 1234567
  }
}
```

---

## 🎯 أفضل الممارسات

1. **استخدم متغيرات البيئة** لتسهيل التبديل بين البيئات
2. **احفظ التوكن** في متغير بعد تسجيل الدخول
3. **تحقق من الاستجابات** قبل المتابعة
4. **استخدم Rate Limiting** بحكمة
5. **اختبر جميع السيناريوهات** (نجاح وفشل)

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من صحة التوكن
2. تأكد من صحة البيانات المرسلة
3. راجع رموز الأخطاء
4. تحقق من اتصال الخادم

---

**تم إنشاء هذا الدليل لـ Hassan App API v1** 🚀
**آخر تحديث: 21 أكتوبر 2025** 📅
