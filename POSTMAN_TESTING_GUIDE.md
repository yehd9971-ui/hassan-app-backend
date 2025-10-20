# دليل اختبار API في Postman

## إعداد Postman

### 1. إنشاء Environment
أنشئ environment جديد في Postman:
- `base_url`: `http://localhost:3000`
- `token`: (سيتم ملؤه بعد تسجيل الدخول)

## اختبارات API

### 1. اختبار الصحة العامة
```
GET {{base_url}}/health
```
**النتيجة المتوقعة:**
```json
{
  "status": "OK",
  "uptime": 20.1147579,
  "database": "Connected",
  "timestamp": "2025-10-18T23:36:31.086Z"
}
```

### 2. اختبار الصفحة الرئيسية
```
GET {{base_url}}/
```
**النتيجة المتوقعة:**
```json
{
  "message": "مرحباً! خادم Node.js مع Express و TypeScript يعمل بنجاح",
  "status": "success",
  "timestamp": "2025-10-18T23:36:31.086Z"
}
```

### 3. تسجيل الدخول (للحصول على Token)
```
POST {{base_url}}/hassan-app/login
Content-Type: application/json

{
  "username": "poet",
  "password": "password"
}
```
**النتيجة المتوقعة:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "role": "poet",
      "username": "poet"
    }
  }
}
```

**⚠️ مهم:** انسخ الـ token من الاستجابة واحفظه في متغير `token` في Postman.

### 4. اختبار جلب القصائد (عام - لا يحتاج مصادقة)
```
GET {{base_url}}/poems
```
**النتيجة المتوقعة:**
```json
{
  "success": true,
  "message": "تم العثور على 0 قصيدة من أصل 0",
  "data": [],
  "count": 0,
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalCount": 0,
    "totalPages": 0,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 5. اختبار إنشاء قصيدة (محمية - يحتاج مصادقة)
```
POST {{base_url}}/poems
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "قصيدة الحب",
  "text": "أحبك يا حبيبي\nأحبك يا روحي\nأحبك يا قلبي",
  "verses": [
    "أحبك يا حبيبي",
    "أحبك يا روحي", 
    "أحبك يا قلبي"
  ],
  "poemType": "عمودي",
  "meter": "فعولن فعولن فعولن فعول",
  "rhyme": "بي",
  "date": "2025-10-18T23:36:31.086Z",
  "lineCount": 3,
  "published": true,
  "tags": ["حب", "شعر", "رومانسي"]
}
```
**النتيجة المتوقعة:**
```json
{
  "success": true,
  "message": "تم إنشاء القصيدة بنجاح",
  "data": {
    "_id": "abc123def456",
    "title": "قصيدة الحب",
    "text": "أحبك يا حبيبي\nأحبك يا روحي\nأحبك يا قلبي",
    "verses": [
      "أحبك يا حبيبي",
      "أحبك يا روحي",
      "أحبك يا قلبي"
    ],
    "poemType": "عمودي",
    "meter": "فعولن فعولن فعولن فعول",
    "rhyme": "بي",
    "date": "2025-10-18T23:36:31.086Z",
    "lineCount": 3,
    "published": true,
    "tags": ["حب", "شعر", "رومانسي"],
    "createdAt": "2025-10-18T23:36:31.086Z",
    "updatedAt": "2025-10-18T23:36:31.086Z"
  }
}
```

### 6. اختبار جلب قصيدة بالمعرف
```
GET {{base_url}}/poems/{{poem_id}}
```
(استبدل `{{poem_id}}` بالمعرف الفعلي من الاستجابة السابقة)

### 7. اختبار البحث في القصائد
```
GET {{base_url}}/poems/search?q=حب&type=عمودي&published=true
```

### 8. اختبار تحديث قصيدة (محمية)
```
PUT {{base_url}}/poems/{{poem_id}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "قصيدة الحب المحدثة",
  "published": false
}
```

### 9. اختبار حذف قصيدة (محمية)
```
DELETE {{base_url}}/poems/{{poem_id}}
Authorization: Bearer {{token}}
```

## اختبارات الأمان

### 1. اختبار إنشاء قصيدة بدون مصادقة (يجب أن يفشل)
```
POST {{base_url}}/poems
Content-Type: application/json

{
  "title": "قصيدة بدون مصادقة",
  "text": "هذا يجب أن يفشل"
}
```
**النتيجة المتوقعة:**
```json
{
  "success": false,
  "code": "TOKEN_REQUIRED",
  "message": "رمز المصادقة مطلوب"
}
```

### 2. اختبار Token غير صالح
```
POST {{base_url}}/poems
Authorization: Bearer invalid-token
Content-Type: application/json

{
  "title": "قصيدة مع token خاطئ",
  "text": "هذا يجب أن يفشل"
}
```
**النتيجة المتوقعة:**
```json
{
  "success": false,
  "code": "TOKEN_INVALID",
  "message": "رمز المصادقة غير صالح"
}
```

### 3. اختبار Rate Limiting
قم بإرسال نفس الطلب عدة مرات متتالية (أكثر من 5 مرات في 15 دقيقة) لاختبار rate limiting.

## اختبارات التحقق من البيانات

### 1. اختبار بيانات غير صحيحة
```
POST {{base_url}}/poems
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "",
  "text": "",
  "verses": []
}
```
**النتيجة المتوقعة:**
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "بيانات غير صحيحة",
  "errors": [
    {
      "field": "title",
      "message": "العنوان مطلوب"
    },
    {
      "field": "text", 
      "message": "نص القصيدة مطلوب"
    },
    {
      "field": "verses",
      "message": "يجب أن تحتوي القصيدة على بيت واحد على الأقل"
    }
  ]
}
```

## ملاحظات مهمة

1. **الخادم يعمل على:** `http://localhost:3000`
2. **قاعدة البيانات:** وهمية (Mock) - البيانات لا تُحفظ بشكل دائم
3. **المصادقة:** JWT مع انتهاء صلاحية 24 ساعة
4. **Rate Limiting:** 
   - المصادقة: 5 طلبات/15 دقيقة
   - الكتابة: 20 طلب/دقيقة
   - القراءة: 120 طلب/دقيقة
5. **جميع الرسائل باللغة العربية**
6. **دعم Pagination في جلب القصائد**

## استكشاف الأخطاء

إذا واجهت مشاكل:
1. تأكد من أن الخادم يعمل على المنفذ 3000
2. تأكد من صحة الـ token في Authorization header
3. تحقق من Content-Type في الطلبات
4. راجع رسائل الخطأ في Postman Console
