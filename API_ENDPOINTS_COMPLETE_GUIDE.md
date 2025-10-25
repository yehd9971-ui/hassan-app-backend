# 📡 دليل شامل لجميع الـ Endpoints - Hassan App API

## 🎯 **نظرة عامة**

هذا الدليل يحتوي على جميع الـ endpoints المتاحة في Hassan App API مع شرح مفصل لكل endpoint ووظيفته.

---

## 🏠 **الرئيسية (Root Endpoints)**

### **1. الصفحة الرئيسية**
```
GET /
```
**الوصف:** الصفحة الرئيسية للتطبيق  
**المصادقة:** غير مطلوبة  
**المعاملات:** لا يوجد  
**الاستجابة:**
```json
{
  "message": "مرحباً! خادم Node.js مع Express و TypeScript يعمل بنجاح",
  "status": "success",
  "timestamp": "2025-10-24T16:00:00.000Z"
}
```

### **2. فحص الصحة البسيط**
```
GET /health
```
**الوصف:** فحص سريع لصحة الخادم  
**المصادقة:** غير مطلوبة  
**المعاملات:** لا يوجد  
**الاستجابة:** `OK` (200)

### **3. فحص الصحة المفصل**
```
GET /health/detailed
```
**الوصف:** فحص مفصل للخادم وقاعدة البيانات  
**المصادقة:** غير مطلوبة  
**المعاملات:** لا يوجد  
**الاستجابة:**
```json
{
  "status": "OK",
  "uptime": 3600,
  "database": "Connected",
  "timestamp": "2025-10-24T16:00:00.000Z"
}
```

---

## 🔐 **المصادقة (Authentication Endpoints)**

### **4. ترحيب Hassan App**
```
GET /hassan-app
```
**الوصف:** صفحة ترحيب للتطبيق  
**المصادقة:** غير مطلوبة  
**الاستجابة:**
```json
{
  "message": "مرحباً بك في Hassan App!",
  "app": "Hassan App",
  "version": "1.0.0",
  "status": "active",
  "timestamp": "2025-10-24T16:00:00.000Z"
}
```

### **5. معلومات التطبيق**
```
GET /hassan-app/info
```
**الوصف:** معلومات مفصلة عن التطبيق وقاعدة البيانات  
**المصادقة:** غير مطلوبة  
**الاستجابة:**
```json
{
  "app": "Hassan App",
  "version": "1.0.0",
  "description": "تطبيق Hassan - مشروع باك إند متقدم",
  "features": ["Node.js + Express + TypeScript", "MongoDB Atlas Integration"],
  "database": {
    "connected": true,
    "name": "learnnode"
  },
  "endpoints": {
    "base": "/hassan-app",
    "info": "/hassan-app/info",
    "health": "/hassan-app/health"
  }
}
```

### **6. فحص صحة Hassan App**
```
GET /hassan-app/health
```
**الوصف:** فحص صحة التطبيق مع معلومات النظام  
**المصادقة:** غير مطلوبة  
**الاستجابة:**
```json
{
  "app": "Hassan App",
  "status": "healthy",
  "database": "connected",
  "uptime": 3600,
  "memory": { "rss": 50000000, "heapTotal": 20000000 },
  "timestamp": "2025-10-24T16:00:00.000Z"
}
```

### **7. تسجيل الدخول**
```
POST /hassan-app/login
```
**الوصف:** تسجيل دخول المستخدم والحصول على JWT token  
**المصادقة:** غير مطلوبة  
**Rate Limit:** 50 محاولة/15 دقيقة  
**Body:**
```json
{
  "username": "admin@example.com",
  "password": "admin123"
}
```
**الاستجابة:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "role": "admin",
      "username": "admin@example.com",
      "name": "Admin User"
    }
  }
}
```

### **8. تسجيل الخروج**
```
POST /hassan-app/logout
```
**الوصف:** تسجيل خروج المستخدم  
**المصادقة:** غير مطلوبة  
**Rate Limit:** 50 محاولة/15 دقيقة  
**الاستجابة:**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

### **9. التحقق من التوكن**
```
GET /hassan-app/verify-token
```
**الوصف:** التحقق من صحة JWT token  
**المصادقة:** مطلوبة (Bearer Token)  
**Rate Limit:** 50 محاولة/15 دقيقة  
**Headers:**
```
Authorization: Bearer your_jwt_token_here
```
**الاستجابة:**
```json
{
  "success": true,
  "message": "التوكن صالح",
  "data": {
    "user": {
      "id": "user_id",
      "role": "admin",
      "username": "admin@example.com"
    }
  }
}
```

### **10. قائمة المستخدمين (قريباً)**
```
GET /hassan-app/users
```
**الوصف:** قائمة المستخدمين (ميزة مستقبلية)  
**المصادقة:** غير مطلوبة  
**الاستجابة:**
```json
{
  "message": "قائمة المستخدمين - قريباً",
  "app": "Hassan App",
  "status": "coming_soon",
  "timestamp": "2025-10-24T16:00:00.000Z"
}
```

### **11. قائمة المنشورات (قريباً)**
```
GET /hassan-app/posts
```
**الوصف:** قائمة المنشورات (ميزة مستقبلية)  
**المصادقة:** غير مطلوبة  
**الاستجابة:**
```json
{
  "message": "قائمة المنشورات - قريباً",
  "app": "Hassan App",
  "status": "coming_soon",
  "timestamp": "2025-10-24T16:00:00.000Z"
}
```

---

## 📖 **القصائد - API v1 (الرئيسية)**

### **12. جلب جميع القصائد**
```
GET /api/v1/poems
```
**الوصف:** جلب القصائد مع فلترة محسّنة وفهرسة مركبة  
**المصادقة:** غير مطلوبة  
**Rate Limit:** 100 طلب/15 دقيقة  
**المعاملات:**
- `published` (boolean): فقط القصائد المنشورة (افتراضي: true)
- `meter` (string): فلترة بالبحر
- `poemType` (string): فلترة بنوع القصيدة
- `sort` (string): ترتيب (new/old) (افتراضي: new)
- `before` (ISO Date): cursor pagination
- `limit` (number): عدد النتائج (1-150) (افتراضي: 50)

**أمثلة:**
```
GET /api/v1/poems?published=true&limit=20
GET /api/v1/poems?published=true&meter=الطويل&limit=10
GET /api/v1/poems?published=true&meter=الطويل&poemType=رباعية&limit=10
GET /api/v1/poems?published=true&before=2025-10-24T07:30:00Z&limit=5
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم العثور على 10 قصيدة من أصل 203",
  "data": [
    {
      "_id": "poem_id",
      "title": "عنوان القصيدة",
      "meter": "الطويل",
      "poemType": "رباعية",
      "verses": ["البيت الأول", "البيت الثاني"],
      "published": true,
      "createdAt": "2025-10-24T16:00:00.000Z"
    }
  ],
  "count": 10,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 203,
    "totalPages": 21,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### **13. البحث في القصائد**
```
GET /api/v1/poems/search
```
**الوصف:** البحث النصي في القصائد  
**المصادقة:** غير مطلوبة  
**Rate Limit:** 100 طلب/15 دقيقة  
**المعاملات:**
- `q` (string): كلمة البحث (مطلوبة)
- `type` (string): نوع القصيدة
- `published` (boolean): فقط المنشورة

**مثال:**
```
GET /api/v1/poems/search?q=الحب&type=رباعية&published=true
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم العثور على 5 قصيدة",
  "data": [...],
  "count": 5
}
```

### **14. جلب قصيدة محددة**
```
GET /api/v1/poems/:id
```
**الوصف:** جلب قصيدة بالمعرف  
**المصادقة:** غير مطلوبة  
**Rate Limit:** 100 طلب/15 دقيقة  
**المعاملات:**
- `id` (string): معرف القصيدة (MongoDB ObjectId)

**مثال:**
```
GET /api/v1/poems/68fb2bb7f577bd6a31b7c02a
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم العثور على القصيدة",
  "data": {
    "_id": "68fb2bb7f577bd6a31b7c02a",
    "title": "عنوان القصيدة",
    "meter": "الطويل",
    "poemType": "رباعية",
    "verses": ["البيت الأول", "البيت الثاني"],
    "published": true,
    "createdAt": "2025-10-24T16:00:00.000Z"
  }
}
```

### **15. إنشاء قصيدة جديدة**
```
POST /api/v1/poems
```
**الوصف:** إنشاء قصيدة جديدة  
**المصادقة:** مطلوبة (Bearer Token)  
**Rate Limit:** 20 طلب/15 دقيقة  
**الصلاحيات:** poet, admin  
**Headers:**
```
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
```
**Body:**
```json
{
  "title": "عنوان القصيدة",
  "meter": "الطويل",
  "poemType": "رباعية",
  "verses": ["البيت الأول", "البيت الثاني"],
  "published": true,
  "author": "اسم الشاعر",
  "customField": "أي قيمة"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم إنشاء القصيدة بنجاح",
  "data": {
    "_id": "new_poem_id",
    "title": "عنوان القصيدة",
    "meter": "الطويل",
    "poemType": "رباعية",
    "verses": ["البيت الأول", "البيت الثاني"],
    "published": true,
    "createdAt": "2025-10-24T16:00:00.000Z",
    "updatedAt": "2025-10-24T16:00:00.000Z"
  }
}
```

### **16. تحديث قصيدة**
```
PUT /api/v1/poems/:id
```
**الوصف:** تحديث قصيدة موجودة  
**المصادقة:** مطلوبة (Bearer Token)  
**Rate Limit:** 20 طلب/15 دقيقة  
**الصلاحيات:** poet, admin  
**Headers:**
```
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
```
**Body:**
```json
{
  "title": "عنوان محدث",
  "meter": "الكامل",
  "published": true
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم تحديث القصيدة بنجاح",
  "data": {
    "_id": "poem_id",
    "title": "عنوان محدث",
    "meter": "الكامل",
    "updatedAt": "2025-10-24T16:00:00.000Z"
  }
}
```

### **17. حذف قصيدة**
```
DELETE /api/v1/poems/:id
```
**الوصف:** حذف قصيدة  
**المصادقة:** مطلوبة (Bearer Token)  
**Rate Limit:** 20 طلب/15 دقيقة  
**الصلاحيات:** poet, admin  
**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم حذف القصيدة بنجاح"
}
```

---

## 📊 **الإحصائيات - API v1 (جديد)**

### **18. إحصائيات شاملة**
```
GET /api/v1/stats/overview
```
**الوصف:** إحصائيات شاملة لجميع القصائد والبحور والأنواع  
**المصادقة:** غير مطلوبة  
**Rate Limit:** 100 طلب/15 دقيقة  
**المعاملات:** لا يوجد  

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم جلب الإحصائيات الشاملة بنجاح",
  "data": {
    "totalPoems": 422,
    "publishedPoems": 422,
    "meters": {
      "الطويل": 203,
      "الكامل": 45,
      "الوافر": 60,
      "السريع": 3
    },
    "types": {
      "رباعية": 150,
      "كاملة": 100,
      "ثنائية": 80,
      "ثلاثية": 50,
      "يتيم": 42
    },
    "lastUpdated": "2025-10-24T16:00:00.000Z"
  }
}
```

### **19. إحصائيات مرنة (الطريقة المفضلة)**
```
GET /api/v1/stats
```
**الوصف:** إحصائيات مرنة مع إمكانية الفلترة والتجميع  
**المصادقة:** غير مطلوبة  
**Rate Limit:** 100 طلب/15 دقيقة  
**المعاملات:**
- `meter` (string): فلترة بالبحر
- `poemType` (string): فلترة بالنوع
- `published` (boolean): فقط المنشورة (افتراضي: true)
- `groupBy` (string): تجميع (meter/poemType)

**أمثلة:**
```
GET /api/v1/stats
GET /api/v1/stats?meter=الطويل
GET /api/v1/stats?poemType=رباعية
GET /api/v1/stats?meter=الطويل&poemType=كاملة
GET /api/v1/stats?groupBy=meter
GET /api/v1/stats?groupBy=poemType
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم جلب الإحصائيات بنجاح",
  "data": {
    "totalCount": 203,
    "breakdown": {
      "رباعية": 100,
      "كاملة": 50,
      "ثلاثية": 30,
      "ثنائية": 20,
      "يتيم": 3
    },
    "filter": {
      "meter": "الطويل",
      "poemType": "جميع الأنواع",
      "published": true
    },
    "groupBy": "poemType"
  }
}
```

### **20. إحصائيات بحر معين**
```
GET /api/v1/stats/meter/:meter
```
**الوصف:** إحصائيات مفصلة لبحر معين  
**المصادقة:** غير مطلوبة  
**Rate Limit:** 100 طلب/15 دقيقة  
**المعاملات:**
- `meter` (string): اسم البحر (في المسار)
- `poemType` (string): فلترة بالنوع
- `published` (boolean): فقط المنشورة (افتراضي: true)

**أمثلة:**
```
GET /api/v1/stats/meter/الطويل
GET /api/v1/stats/meter/الطويل?poemType=رباعية
GET /api/v1/stats/meter/الكامل?published=true
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "إحصائيات بحر الطويل",
  "data": {
    "meter": "الطويل",
    "totalCount": 203,
    "breakdown": {
      "رباعية": 100,
      "كاملة": 50,
      "ثلاثية": 30,
      "ثنائية": 20,
      "يتيم": 3
    },
    "filter": {
      "published": true,
      "poemType": "جميع الأنواع"
    }
  }
}
```

### **21. إحصائيات نوع معين**
```
GET /api/v1/stats/type/:type
```
**الوصف:** إحصائيات مفصلة لنوع قصيدة معين  
**المصادقة:** غير مطلوبة  
**Rate Limit:** 100 طلب/15 دقيقة  
**المعاملات:**
- `type` (string): نوع القصيدة (في المسار)
- `meter` (string): فلترة بالبحر
- `published` (boolean): فقط المنشورة (افتراضي: true)

**أمثلة:**
```
GET /api/v1/stats/type/رباعية
GET /api/v1/stats/type/رباعية?meter=الطويل
GET /api/v1/stats/type/كاملة?published=true
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "إحصائيات نوع رباعية",
  "data": {
    "type": "رباعية",
    "totalCount": 150,
    "breakdown": {
      "الطويل": 100,
      "الكامل": 25,
      "الوافر": 15,
      "المديد": 10
    },
    "filter": {
      "published": true,
      "meter": "جميع البحور"
    }
  }
}
```

---

## 🔄 **Legacy Endpoints (مهملة)**

### **22-27. Legacy Poems Routes**
```
GET    /poems                    # إعادة توجيه إلى /api/v1/poems
GET    /poems/search             # إعادة توجيه إلى /api/v1/poems/search
GET    /poems/:id                # إعادة توجيه إلى /api/v1/poems/:id
POST   /poems                    # إعادة توجيه إلى /api/v1/poems
PUT    /poems/:id                # إعادة توجيه إلى /api/v1/poems/:id
DELETE /poems/:id                # إعادة توجيه إلى /api/v1/poems/:id
```
**الوصف:** جميع طلبات `/poems` يتم إعادة توجيهها تلقائياً إلى `/api/v1/poems`  
**Headers:** `Deprecation: true`, `Sunset: Tue, 30 Dec 2025 23:59:59 GMT`  
**Status Code:** 308 (Permanent Redirect)

---

## 🛡️ **Rate Limiting**

| نوع الطلب | الحد الأقصى | الفترة الزمنية |
|-----------|-------------|----------------|
| قراءة عامة | 100 طلب | 15 دقيقة |
| كتابة | 20 طلب | 15 دقيقة |
| مصادقة | 50 محاولة | 15 دقيقة |

---

## 🔐 **المصادقة والصلاحيات**

### **المصادقة المطلوبة:**
- `POST /api/v1/poems` (إنشاء قصيدة)
- `PUT /api/v1/poems/:id` (تحديث قصيدة)
- `DELETE /api/v1/poems/:id` (حذف قصيدة)
- `GET /hassan-app/verify-token` (التحقق من التوكن)

### **الصلاحيات:**
- **poet:** يمكن إنشاء وتعديل وحذف قصائده فقط
- **admin:** يمكن إدارة جميع القصائد

### **استخدام التوكن:**
```
Authorization: Bearer your_jwt_token_here
```

---

## 📊 **البيانات المدعومة**

### **البحور المدعومة:**
الطويل، المديد، البسيط، الوافر، الكامل، الهزج، الرجز، الرمل، السريع، المنسرح، الخفيف، المضارع، المقتضب، المجتث، المتقارب، المتدارك

### **أنواع القصائد المدعومة:**
كاملة، رباعية، ثلاثية، ثنائية، يتيم

---

## 🚀 **أمثلة الاستخدام السريع**

### **جلب قصائد الطويل:**
```bash
curl "https://hassan-app-backend-hassan-app.up.railway.app/api/v1/poems?published=true&meter=الطويل&limit=10"
```

### **إحصائيات بحر الكامل:**
```bash
curl "https://hassan-app-backend-hassan-app.up.railway.app/api/v1/stats/meter/الكامل"
```

### **تسجيل الدخول:**
```bash
curl -X POST "https://hassan-app-backend-hassan-app.up.railway.app/hassan-app/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@example.com","password":"admin123"}'
```

---

## 📝 **ملاحظات مهمة**

1. **جميع التواريخ** بصيغة ISO 8601
2. **URL Encoding** تلقائي للمعاملات العربية
3. **CORS** مفعل لـ `http://localhost:3000` و `http://localhost:4000`
4. **الفهرسة المركبة** محسّنة للأداء
5. **التحقق من البيانات** باستخدام Zod schemas
6. **معالجة الأخطاء** شاملة ومفصلة

---

**إجمالي الـ Endpoints: 27 endpoint**  
**تاريخ آخر تحديث: 24 أكتوبر 2025**  
**الإصدار: 1.0.0**
