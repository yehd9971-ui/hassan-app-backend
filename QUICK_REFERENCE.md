# ⚡ مرجع سريع - Quick Reference

## 🚀 تشغيل المشروع

```bash
# تطوير
npm run dev

# بناء
npm run build

# إنتاج
npm start
```

---

## 🔧 صيانة الفهارس

```bash
# إنشاء/مزامنة الفهارس (مرة واحدة)
npm run sync:indexes

# تنظيف حقول meter و poemType (مرة واحدة)
npm run clean:fields
```

---

## 📡 نقاط النهاية الرئيسية (Endpoints)

### 🔐 المصادقة
```
POST   /hassan-app/login           # تسجيل الدخول
GET    /hassan-app/verify-token    # التحقق من التوكن
POST   /hassan-app/logout          # تسجيل الخروج
```

### 📖 القصائد (API v1)
```
GET    /api/v1/poems               # جلب القصائد (محسّن)
GET    /api/v1/poems/:id           # جلب قصيدة محددة
POST   /api/v1/poems               # إنشاء قصيدة (يتطلب مصادقة)
PUT    /api/v1/poems/:id           # تحديث قصيدة (يتطلب مصادقة)
DELETE /api/v1/poems/:id           # حذف قصيدة (يتطلب مصادقة)
GET    /api/v1/poems/search        # البحث في القصائد
```

### 🏥 الصحة
```
GET    /health                     # فحص بسيط
GET    /health/detailed            # فحص مفصل مع قاعدة البيانات
```

---

## 🔍 معاملات الاستعلام (Query Params)

### GET /api/v1/poems

| المعامل | النوع | الافتراضي | مثال |
|---------|------|----------|------|
| `published` | boolean | `true` | `?published=true` |
| `meter` | string | - | `?meter=الطويل` |
| `poemType` | string | - | `?poemType=كاملة` |
| `sort` | `'new'`\|`'old'` | `'new'` | `?sort=new` |
| `before` | ISO Date | - | `?before=2025-10-24T07:30:00Z` |
| `limit` | number | `50` | `?limit=20` (max: 150) |

---

## ✅ البحور المسموح بها

```
الطويل، المديد، البسيط، الوافر، الكامل، الهزج،
الرجز، الرمل، السريع، المنسرح، الخفيف، المضارع،
المقتضب، المجتث، المتقارب، المتدارك
```

---

## ✅ أنواع القصائد المسموح بها

```
كاملة، رباعية، ثلاثية، ثنائية، يتيم
```

---

## 📝 أمثلة سريعة

### جلب جميع القصائد المنشورة
```bash
curl http://localhost:3000/api/v1/poems?published=true&limit=20
```

### فلترة بالبحر
```bash
curl http://localhost:3000/api/v1/poems?published=true&meter=الطويل&limit=10
```

### فلترة بالبحر والنوع
```bash
curl "http://localhost:3000/api/v1/poems?published=true&meter=الطويل&poemType=كاملة&limit=10"
```

### Cursor Pagination
```bash
# الصفحة الأولى
curl "http://localhost:3000/api/v1/poems?published=true&meter=الطويل&limit=5"

# الصفحة التالية
curl "http://localhost:3000/api/v1/poems?published=true&meter=الطويل&before=2025-10-24T07:30:00Z&limit=5"
```

---

## 🔐 المصادقة (Authentication)

### 1. تسجيل الدخول
```bash
curl -X POST http://localhost:3000/hassan-app/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**النتيجة:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "username": "admin", "role": "admin" }
}
```

### 2. استخدام التوكن
```bash
curl http://localhost:3000/api/v1/poems \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🗄️ متغيرات البيئة

```bash
# .env
MONGODB_URI=mongodb+srv://user:pass@host/database
JWT_SECRET=your_secret_key_here
PORT=3000
NODE_ENV=production
REDIS_URL=redis://localhost:6379
```

---

## 🐛 استكشاف الأخطاء

### خطأ: "Cannot connect to MongoDB"
```bash
# تحقق من MONGODB_URI
echo $MONGODB_URI  # Linux/Mac
echo $env:MONGODB_URI  # Windows PowerShell
```

### خطأ: "Healthcheck failed"
```bash
# تحقق من أن السيرفر يعمل
curl http://localhost:3000/health

# تحقق من اللوجات
npm start
```

### خطأ: "VALIDATION_ERROR"
- تأكد من أن `meter` من القائمة المسموح بها
- تأكد من أن `poemType` من القائمة المسموح بها
- تأكد من أن `sort` إما `new` أو `old`

---

## 📊 الفهرس المركب

### البنية
```javascript
{
  meter: 1,
  poemType: 1,
  createdAt: -1
}
```

### الفلتر الجزئي
```javascript
{ published: true }
```

### التحقق من الفهرس
```javascript
// في MongoDB Shell
db.poems.getIndexes()

// أو عبر السكريبت
npm run sync:indexes
```

---

## 🧪 الاختبار

### Postman
1. استورد `Hassan_App_Postman_Collection_V1_Optimized.json`
2. عدّل المتغيرات: `base_url`, `token`, `poem_id`
3. شغّل الطلبات

### cURL
```bash
# اختبار Health
curl http://localhost:3000/health

# اختبار API
curl "http://localhost:3000/api/v1/poems?published=true&limit=5"
```

---

## 📚 التوثيق الكامل

| الملف | الوصف |
|------|-------|
| `INDEX_OPTIMIZATION_SUMMARY.md` | ملخص التحسينات |
| `COMPOUND_INDEX_GUIDE.md` | دليل الفهرس المركب |
| `API_TESTS.md` | اختبارات API |
| `README.md` | توثيق المشروع |

---

## 🚀 النشر على Railway

1. **ادفع الكود إلى GitHub**
```bash
git push origin main
```

2. **عيّن المتغيرات في Railway**
- `MONGODB_URI`
- `JWT_SECRET`
- `PORT` (اختياري، افتراضي: 3000)
- `NODE_ENV=production`

3. **تحقق من الصحة**
```bash
curl https://your-app.railway.app/health
```

4. **مزامنة الفهارس (مرة واحدة)**
```bash
# في Railway Shell أو محلياً مع MONGODB_URI من Railway
npm run sync:indexes
```

---

## 💡 نصائح سريعة

1. **للحصول على أفضل أداء:**
   - استخدم `published=true`
   - استخدم `meter` قبل `poemType`
   - استخدم cursor pagination بدلاً من offset

2. **لتحسين الأمان:**
   - غيّر `JWT_SECRET` في الإنتاج
   - استخدم HTTPS في الإنتاج
   - فعّل rate limiting

3. **للصيانة:**
   - شغّل `npm run clean:fields` مرة واحدة
   - راقب MongoDB Performance Advisor
   - احذف القصائد غير المنشورة القديمة

---

**آخر تحديث:** 24 أكتوبر 2025

