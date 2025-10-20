# دليل API للتطبيق - Postman Testing Guide

## 📋 نظرة عامة
هذا الدليل يوضح جميع المسارات المتاحة في التطبيق وكيفية اختبارها باستخدام Postman.

**الخادم الأساسي**: `http://localhost:3000`

---

## 🔧 إعداد Postman

### 1. متغيرات البيئة
قم بإنشاء Environment في Postman مع المتغيرات التالية:
- `base_url`: `http://localhost:3000`
- `token`: (سيتم تعيينه بعد تسجيل الدخول)

### 2. Headers الأساسية
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

---

## 🏠 المسارات الأساسية

### 1. الصفحة الرئيسية
```http
GET {{base_url}}/
```
**الوصف**: صفحة الترحيب الأساسية
**الاستجابة المتوقعة**:
```json
{
  "message": "مرحباً! خادم Node.js مع Express و TypeScript يعمل بنجاح",
  "status": "success",
  "timestamp": "2025-10-19T20:23:05.673Z"
}
```

### 2. فحص صحة الخادم
```http
GET {{base_url}}/health
```
**الوصف**: فحص حالة الخادم وقاعدة البيانات
**الاستجابة المتوقعة**:
```json
{
  "status": "OK",
  "uptime": 21.9664495,
  "database": "Connected",
  "timestamp": "2025-10-19T20:23:01.862Z"
}
```

---

## 🔐 مسارات المصادقة (Hassan App)

### 1. معلومات التطبيق
```http
GET {{base_url}}/hassan-app
```
**الوصف**: صفحة ترحيب Hassan App

### 2. معلومات مفصلة عن التطبيق
```http
GET {{base_url}}/hassan-app/info
```
**الوصف**: معلومات شاملة عن التطبيق والميزات

### 3. فحص صحة Hassan App
```http
GET {{base_url}}/hassan-app/health
```
**الوصف**: فحص صحة التطبيق والذاكرة

### 4. تسجيل الدخول
```http
POST {{base_url}}/hassan-app/login
Content-Type: application/json

{
  "username": "info@brightc0de.com",
  "password": "StrongP@ssw0rd!"
}
```
**الوصف**: تسجيل دخول المستخدم الإداري
**الاستجابة المتوقعة**:
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "68f54a173306fa8e4b1d2144",
      "role": "admin",
      "username": "info@brightc0de.com",
      "name": "Mahmoud Hassan"
    }
  }
}
```

### 5. تسجيل الخروج
```http
POST {{base_url}}/hassan-app/logout
```
**الوصف**: تسجيل خروج المستخدم

### 6. التحقق من صحة التوكن
```http
GET {{base_url}}/hassan-app/verify-token
Authorization: Bearer {{token}}
```
**الوصف**: التحقق من صحة JWT token

### 7. قائمة المستخدمين (قريباً)
```http
GET {{base_url}}/hassan-app/users
```
**الوصف**: قائمة المستخدمين (ميزة قادمة)

### 8. قائمة المنشورات (قريباً)
```http
GET {{base_url}}/hassan-app/posts
```
**الوصف**: قائمة المنشورات (ميزة قادمة)

---

## 📝 مسارات القصائد (Poems)

### 1. جلب جميع القصائد
```http
GET {{base_url}}/poems
```
**الوصف**: جلب جميع القصائد مع إمكانية التصفح
**Query Parameters**:
- `page`: رقم الصفحة (افتراضي: 1)
- `limit`: عدد القصائد في الصفحة (افتراضي: 10)
- `sortBy`: ترتيب حسب (title, createdAt, updatedAt)
- `sortOrder`: اتجاه الترتيب (asc, desc)

**مثال**:
```http
GET {{base_url}}/poems?page=1&limit=5&sortBy=createdAt&sortOrder=desc
```

### 2. البحث في القصائد
```http
GET {{base_url}}/poems/search
```
**الوصف**: البحث في القصائد
**Query Parameters**:
- `q`: نص البحث
- `page`: رقم الصفحة
- `limit`: عدد النتائج

**مثال**:
```http
GET {{base_url}}/poems/search?q=حب&page=1&limit=10
```

### 3. جلب قصيدة بالمعرف
```http
GET {{base_url}}/poems/{id}
```
**الوصف**: جلب قصيدة محددة بالمعرف
**مثال**:
```http
GET {{base_url}}/poems/68f54a173306fa8e4b1d2144
```

### 4. إنشاء قصيدة جديدة (محمي)
```http
POST {{base_url}}/poems
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "عنوان القصيدة",
  "text": "نص القصيدة الكامل هنا...",
  "author": "اسم الشاعر",
  "category": "فئة القصيدة",
  "tags": ["كلمة1", "كلمة2", "كلمة3"],
  "isPublic": true
}
```
**الوصف**: إنشاء قصيدة جديدة (يتطلب مصادقة وصلاحيات poet أو admin)

### 5. تحديث قصيدة (محمي)
```http
PUT {{base_url}}/poems/{id}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "عنوان القصيدة المحدث",
  "text": "نص القصيدة المحدث...",
  "author": "اسم الشاعر المحدث",
  "category": "فئة القصيدة المحدثة",
  "tags": ["كلمة1", "كلمة2", "كلمة3"],
  "isPublic": true
}
```
**الوصف**: تحديث قصيدة موجودة (يتطلب مصادقة وصلاحيات poet أو admin)

### 6. حذف قصيدة (محمي)
```http
DELETE {{base_url}}/poems/{id}
Authorization: Bearer {{token}}
```
**الوصف**: حذف قصيدة (يتطلب مصادقة وصلاحيات poet أو admin)

---

## 🔒 نظام المصادقة والصلاحيات

### أنواع المستخدمين
- **admin**: صلاحيات كاملة
- **poet**: يمكن إنشاء وتعديل وحذف القصائد
- **user**: صلاحيات محدودة

### كيفية الحصول على Token
1. قم بتسجيل الدخول باستخدام `/hassan-app/login`
2. انسخ الـ token من الاستجابة
3. ضعه في متغير البيئة `token`
4. استخدمه في Header: `Authorization: Bearer {{token}}`

---

## 📊 أمثلة على الاستجابات

### استجابة ناجحة
```json
{
  "success": true,
  "message": "تمت العملية بنجاح",
  "data": {
    // البيانات المطلوبة
  }
}
```

### استجابة خطأ
```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "رسالة الخطأ باللغة العربية"
}
```

### رموز الأخطاء الشائعة
- `MISSING_CREDENTIALS`: بيانات تسجيل الدخول مفقودة
- `INVALID_CREDENTIALS`: بيانات تسجيل الدخول غير صحيحة
- `TOKEN_REQUIRED`: رمز المصادقة مطلوب
- `TOKEN_INVALID`: رمز المصادقة غير صالح
- `VALIDATION_ERROR`: خطأ في التحقق من البيانات
- `DATABASE_ERROR`: خطأ في قاعدة البيانات
- `NOT_FOUND`: الصفحة أو المورد غير موجود

---

## 🚀 خطوات الاختبار السريع

### 1. اختبار الاتصال الأساسي
```http
GET {{base_url}}/health
```

### 2. تسجيل الدخول
```http
POST {{base_url}}/hassan-app/login
{
  "username": "info@brightc0de.com",
  "password": "StrongP@ssw0rd!"
}
```

### 3. التحقق من التوكن
```http
GET {{base_url}}/hassan-app/verify-token
Authorization: Bearer {{token}}
```

### 4. جلب القصائد
```http
GET {{base_url}}/poems
```

### 5. إنشاء قصيدة جديدة
```http
POST {{base_url}}/poems
Authorization: Bearer {{token}}
{
  "title": "قصيدة تجريبية",
  "text": "هذه قصيدة تجريبية لاختبار النظام",
  "author": "Mahmoud Hassan",
  "category": "تجريبي",
  "tags": ["تجريب", "اختبار"],
  "isPublic": true
}
```

---

## 📝 ملاحظات مهمة

1. **Rate Limiting**: التطبيق يستخدم نظام تحديد المعدل، لا تزيد عن 100 طلب في الدقيقة
2. **JWT Token**: صالح لمدة 24 ساعة
3. **CORS**: مفعل للطلبات من جميع المصادر
4. **Security Headers**: التطبيق يستخدم رؤوس أمان متقدمة
5. **Database**: متصل بـ MongoDB Atlas

---

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة وحلولها

1. **خطأ 401 Unauthorized**
   - تأكد من صحة التوكن
   - تحقق من وجود `Bearer ` قبل التوكن

2. **خطأ 400 Bad Request**
   - تحقق من صحة البيانات المرسلة
   - تأكد من Content-Type: application/json

3. **خطأ 500 Internal Server Error**
   - تحقق من حالة الخادم
   - راجع سجلات الخادم

4. **خطأ 404 Not Found**
   - تحقق من صحة المسار
   - تأكد من أن الخادم يعمل

---

## 📞 الدعم

للحصول على المساعدة أو الإبلاغ عن مشاكل، يرجى مراجعة:
- سجلات الخادم في Terminal
- ملف `README.md`
- ملف `SECURITY_FEATURES.md`

---

**آخر تحديث**: 19 أكتوبر 2025
**الإصدار**: 1.0.0
