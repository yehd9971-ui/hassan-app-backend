# دليل نظام تسجيل الدخول

## ✅ تم تفعيل نظام تسجيل الدخول بنجاح!

### 🔐 **المستخدمون المتاحون:**

#### 1. **المدير (Admin):**
- **البريد الإلكتروني:** `admin@example.com`
- **كلمة المرور:** `StrongP@ssw0rd!`
- **الدور:** `admin`
- **الصلاحيات:** كاملة (جميع المسارات)

#### 2. **الشاعر (Poet):**
- **البريد الإلكتروني:** `poet@example.com`
- **كلمة المرور:** `StrongP@ssw0rd!`
- **الدور:** `poet`
- **الصلاحيات:** إدارة القصائد فقط

## 🚀 **المسارات المتاحة:**

### 1. **تسجيل الدخول:**
```http
POST http://localhost:3000/hassan-app/login
Content-Type: application/json

{
  "username": "admin@example.com",
  "password": "StrongP@ssw0rd!"
}
```

**الاستجابة الناجحة:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "role": "admin",
      "username": "admin@example.com",
      "name": "Mahmoud Hassan"
    }
  }
}
```

### 2. **تسجيل الخروج:**
```http
POST http://localhost:3000/hassan-app/logout
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

### 3. **التحقق من صحة التوكن:**
```http
GET http://localhost:3000/hassan-app/verify-token
Authorization: Bearer YOUR_TOKEN_HERE
```

**الاستجابة الناجحة:**
```json
{
  "success": true,
  "message": "التوكن صالح",
  "data": {
    "user": {
      "id": "1",
      "role": "admin",
      "username": "admin@example.com",
      "iat": 1697640000,
      "exp": 1697726400
    }
  }
}
```

## 🧪 **اختبار في Postman:**

### **الخطوة 1: تسجيل الدخول**
1. **Method:** POST
2. **URL:** `http://localhost:3000/hassan-app/login`
3. **Headers:** `Content-Type: application/json`
4. **Body:**
   ```json
   {
     "username": "admin@example.com",
     "password": "StrongP@ssw0rd!"
   }
   ```

### **الخطوة 2: نسخ التوكن**
- انسخ قيمة `token` من الاستجابة
- استخدمه في المسارات المحمية

### **الخطوة 3: اختبار مسار محمي**
1. **Method:** POST
2. **URL:** `http://localhost:3000/poems`
3. **Headers:** 
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_TOKEN_HERE`
4. **Body:**
   ```json
   {
     "title": "قصيدة جديدة",
     "text": "نص القصيدة هنا",
     "tags": ["شعر", "حب"]
   }
   ```

## 🔒 **الميزات الأمنية:**

### 1. **تشفير كلمات المرور:**
- استخدام `bcrypt` مع salt rounds = 12
- كلمات المرور مشفرة في قاعدة البيانات

### 2. **JWT Tokens:**
- انتهاء صلاحية: 24 ساعة
- تشفير آمن مع JWT_SECRET
- يحتوي على: id, role, username

### 3. **Rate Limiting:**
- 5 محاولات تسجيل دخول كل 15 دقيقة
- حماية من هجمات Brute Force

### 4. **التحقق من البيانات:**
- التحقق من وجود username و password
- رسائل خطأ واضحة باللغة العربية

## 📊 **أكواد الاستجابة:**

| الكود | المعنى | السبب |
|-------|--------|--------|
| 200 | نجح | تسجيل دخول ناجح |
| 400 | خطأ في البيانات | username أو password مفقود |
| 401 | غير مصرح | بيانات خاطئة أو توكن غير صالح |
| 429 | كثير جداً | تجاوز حد المحاولات |
| 500 | خطأ خادم | خطأ داخلي |

## 🎯 **الخطوات التالية:**

1. **اختبار تسجيل الدخول** مع كلا المستخدمين
2. **نسخ التوكن** من الاستجابة
3. **اختبار المسارات المحمية** (إنشاء/تحديث/حذف القصائد)
4. **اختبار التحقق من التوكن**

## ⚠️ **ملاحظات مهمة:**

- **التوكن صالح لمدة 24 ساعة**
- **احتفظ بالتوكن في مكان آمن**
- **استخدم Authorization header مع Bearer**
- **النظام يعمل مع قاعدة البيانات الوهمية حالياً**

**النظام جاهز للاستخدام! 🚀**
