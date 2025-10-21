# 🚀 Hassan App API v1 - دليل البدء السريع

## 📥 استيراد الملفات في Postman

### 1. استيراد Collection
```
File → Import → Hassan_App_API_v1_Collection.json
```

### 2. استيراد Environment
```
File → Import → Hassan_App_API_v1_Environment.json
```

### 3. تفعيل Environment
- اختر "Hassan App API v1 Environment" من القائمة المنسدلة
- تأكد من تفعيله (الضوء الأخضر)

---

## ⚙️ إعداد سريع

### 1. تحديث BASE_URL
```
BASE_URL: https://your-actual-railway-url.railway.app
```

### 2. بيانات تسجيل الدخول
```
username: admin@example.com
password: your_actual_password
```

---

## 🎯 الاختبار السريع (5 دقائق)

### الخطوة 1: فحص الخادم
```
GET /health
```
**النتيجة المتوقعة:** `OK`

### الخطوة 2: تسجيل الدخول
```
POST /hassan-app/login
{
  "username": "admin@example.com",
  "password": "your_password"
}
```
**النتيجة:** سيتم حفظ التوكن تلقائياً

### الخطوة 3: إنشاء قصيدة
```
POST /api/v1/poems
Authorization: Bearer {{JWT_TOKEN}}
{
  "title": "قصيدة الاختبار",
  "text": "هذه قصيدة للاختبار",
  "verses": ["هذه قصيدة للاختبار"],
  "poemType": "عمودي",
  "published": true
}
```

### الخطوة 4: جلب القصائد
```
GET /api/v1/poems
```

### الخطوة 5: البحث
```
GET /api/v1/poems/search?q=اختبار
```

---

## 🔧 نصائح سريعة

### 1. حفظ التوكن تلقائياً
- Collection يحتوي على Test Scripts
- التوكن سيُحفظ في `JWT_TOKEN` تلقائياً

### 2. استخدام المتغيرات
- `{{BASE_URL}}` - رابط الخادم
- `{{JWT_TOKEN}}` - رمز المصادقة
- `{{POEM_ID}}` - معرف القصيدة

### 3. الاختبار التلقائي
- استخدم "Complete Flow Test" folder
- يشمل تسجيل دخول → إنشاء → تحديث → حذف

---

## 📊 المسارات الرئيسية

| المسار | الطريقة | الوصف | مصادقة |
|--------|---------|--------|---------|
| `/health` | GET | فحص الصحة | ❌ |
| `/hassan-app/login` | POST | تسجيل الدخول | ❌ |
| `/api/v1/poems` | GET | جلب القصائد | ❌ |
| `/api/v1/poems` | POST | إنشاء قصيدة | ✅ |
| `/api/v1/poems/:id` | PUT | تحديث قصيدة | ✅ |
| `/api/v1/poems/:id` | DELETE | حذف قصيدة | ✅ |

---

## 🚨 حل المشاكل السريع

### المشكلة: 401 Unauthorized
**الحل:** تأكد من تسجيل الدخول أولاً

### المشكلة: 404 Not Found
**الحل:** تحقق من صحة BASE_URL

### المشكلة: 429 Too Many Requests
**الحل:** انتظر دقيقة واحدة

### المشكلة: 500 Internal Server Error
**الحل:** تحقق من حالة الخادم

---

## 📱 اختبار على الهاتف

### 1. استخدم Postman Mobile App
### 2. استورد نفس الملفات
### 3. استخدم نفس Environment

---

**🎉 أنت جاهز للبدء!** 

**الملفات المطلوبة:**
- `Hassan_App_API_v1_Collection.json`
- `Hassan_App_API_v1_Environment.json`
- `POSTMAN_API_V1_COMPLETE_GUIDE.md` (دليل مفصل)
