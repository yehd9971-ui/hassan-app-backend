# 🔍 دليل الفهرس المركب - Compound Index Guide

## 📊 الفهرس المركب الجزئي

### الاسم
`idx_meter_type_createdAt_pubTrue`

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
partialFilterExpression: { published: true }
```

---

## 🎯 الهدف من الفهرس

هذا الفهرس مصمم لتحسين أداء الاستعلامات التالية:

1. **جلب القصائد المنشورة فقط** (`published: true`)
2. **فلترة حسب البحر** (`meter`)
3. **فلترة حسب نوع القصيدة** (`poemType`)
4. **ترتيب حسب تاريخ الإنشاء** (`createdAt: -1` للأحدث أولاً)

---

## 🚀 استعلامات مُحسَّنة

### ✅ استعلامات ستستخدم الفهرس (IXSCAN)

```javascript
// 1. جميع القصائد المنشورة (الأحدث أولاً)
GET /api/v1/poems?published=true&sort=new

// 2. قصائد من بحر معين
GET /api/v1/poems?published=true&meter=الطويل&sort=new

// 3. قصائد من نوع معين
GET /api/v1/poems?published=true&poemType=رباعية&sort=new

// 4. فلترة بالبحر والنوع معاً
GET /api/v1/poems?published=true&meter=الطويل&poemType=كاملة&sort=new

// 5. cursor-based pagination
GET /api/v1/poems?published=true&meter=الطويل&before=2025-01-01T00:00:00Z&limit=20
```

### ❌ استعلامات لن تستخدم الفهرس

```javascript
// 1. بدون published=true
GET /api/v1/poems?meter=الطويل

// 2. البحث النصي (يحتاج فهرس نصي منفصل)
GET /api/v1/poems?q=الحب

// 3. فلترة بحقول غير مشمولة في الفهرس
GET /api/v1/poems?author=أحمد&published=true
```

---

## 🔧 إنشاء/مزامنة الفهرس

### الطريقة 1: عبر السكريبت
```bash
npm run sync:indexes
```

### الطريقة 2: عبر MongoDB Compass
1. افتح قاعدة البيانات `hassan-app`
2. افتح مجموعة `poems`
3. اذهب إلى **Indexes**
4. انقر **Create Index**
5. أدخل:
```json
{
  "meter": 1,
  "poemType": 1,
  "createdAt": -1
}
```
6. في **Options**:
```json
{
  "name": "idx_meter_type_createdAt_pubTrue",
  "partialFilterExpression": {
    "published": true
  }
}
```

### الطريقة 3: عبر MongoDB Shell
```javascript
db.poems.createIndex(
  { meter: 1, poemType: 1, createdAt: -1 },
  { 
    name: 'idx_meter_type_createdAt_pubTrue',
    partialFilterExpression: { published: true } 
  }
)
```

---

## 🧪 اختبار الفهرس

### 1. التحقق من وجود الفهرس
```javascript
db.poems.getIndexes()
```

### 2. اختبار الأداء باستخدام Explain
```javascript
db.poems.find({
  published: true,
  meter: 'الطويل',
  poemType: 'كاملة'
}).sort({ createdAt: -1 }).explain('executionStats')
```

### 3. ما يجب أن تراه
```javascript
{
  "executionStats": {
    "executionSuccess": true,
    "nReturned": 10,
    "totalKeysExamined": 10,  // ← نفس عدد النتائج = كفاءة عالية
    "totalDocsExamined": 10,
    "executionTimeMillis": 2,  // ← أقل من 5ms
    "inputStage": {
      "stage": "IXSCAN",  // ← يستخدم الفهرس ✅
      "indexName": "idx_meter_type_createdAt_pubTrue"
    }
  }
}
```

---

## 📋 القيم المسموح بها

### البحور (METERS)
```javascript
[
  'الطويل', 'المديد', 'البسيط', 'الوافر', 'الكامل', 'الهزج',
  'الرجز', 'الرمل', 'السريع', 'المنسرح', 'الخفيف', 'المضارع',
  'المقتضب', 'المجتث', 'المتقارب', 'المتدارك'
]
```

### أنواع القصائد (TYPES)
```javascript
[
  'كاملة', 'رباعية', 'ثلاثية', 'ثنائية', 'يتيم'
]
```

---

## 🧹 تنظيف البيانات

### إزالة المسافات والتشكيل
```bash
npm run clean:fields
```

أو يدوياً عبر MongoDB Shell:
```javascript
db.poems.updateMany(
  {},
  [
    {
      $set: {
        meter: { 
          $cond: {
            if: { $eq: [{ $type: '$meter' }, 'string'] },
            then: { $trim: { input: '$meter' } },
            else: '$meter'
          }
        },
        poemType: {
          $cond: {
            if: { $eq: [{ $type: '$poemType' }, 'string'] },
            then: { $trim: { input: '$poemType' } },
            else: '$poemType'
          }
        }
      }
    }
  ]
)
```

---

## 📊 مراقبة الأداء

### معايير الأداء المتوقعة

| الاستعلام | الوقت المتوقع | نوع المسح |
|----------|---------------|-----------|
| بدون فلترة | < 5ms | IXSCAN |
| مع meter | < 3ms | IXSCAN |
| مع meter + poemType | < 2ms | IXSCAN |
| مع before (cursor) | < 3ms | IXSCAN |

### إشارات المشاكل

- ⚠️ `COLLSCAN` بدلاً من `IXSCAN` → الفهرس غير مستخدم
- ⚠️ `totalKeysExamined >> nReturned` → الفهرس غير فعال
- ⚠️ `executionTimeMillis > 50ms` → مشكلة في الأداء

---

## 🔍 استكشاف الأخطاء

### المشكلة: الفهرس غير مستخدم

**السبب المحتمل:**
1. `published` ليس `true` في الاستعلام
2. الاستعلام يحتوي على فلاتر غير مشمولة في الفهرس
3. الفهرس لم يتم إنشاؤه بعد

**الحل:**
```bash
# تحقق من وجود الفهرس
npm run sync:indexes

# تحقق من الاستعلام
console.log('FILTER→', filter, 'SORT→', sortDoc);
```

### المشكلة: أخطاء VALIDATION_ERROR

**السبب:** قيمة `meter` أو `poemType` غير صالحة

**الحل:**
```javascript
// تحقق من القيم المسموح بها
GET /api/v1/poems?meter=الكويس  // ❌ خطأ
GET /api/v1/poems?meter=الطويل   // ✅ صحيح
```

---

## 📈 إحصائيات الاستخدام

### عرض أكثر البحور استخداماً
```javascript
db.poems.aggregate([
  { $match: { published: true, meter: { $exists: true } } },
  { $group: { _id: '$meter', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 }
])
```

### عرض أكثر الأنواع استخداماً
```javascript
db.poems.aggregate([
  { $match: { published: true, poemType: { $exists: true } } },
  { $group: { _id: '$poemType', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

---

## 🎯 أمثلة استخدام API

### مثال 1: قصائد الطويل الرباعية
```bash
curl "http://localhost:3000/api/v1/poems?published=true&meter=الطويل&poemType=رباعية&limit=20&sort=new"
```

### مثال 2: أحدث قصائد الكامل
```bash
curl "http://localhost:3000/api/v1/poems?published=true&meter=الكامل&sort=new&limit=50"
```

### مثال 3: cursor-based pagination
```bash
# الصفحة الأولى
curl "http://localhost:3000/api/v1/poems?published=true&meter=الطويل&limit=20&sort=new"

# الصفحة التالية (استخدم createdAt من آخر عنصر)
curl "http://localhost:3000/api/v1/poems?published=true&meter=الطويل&before=2025-01-15T10:30:00Z&limit=20&sort=new"
```

### مثال 4: أقدم القصائد
```bash
curl "http://localhost:3000/api/v1/poems?published=true&sort=old&limit=20"
```

---

## 📝 ملاحظات مهمة

1. **الفهرس الجزئي يعمل فقط مع `published: true`**
   - لن يستخدم الفهرس لو `published: false` أو غير موجود

2. **ترتيب الحقول في الفهرس مهم**
   - `meter` → `poemType` → `createdAt`
   - هذا الترتيب يدعم الفلترة التدريجية

3. **الفهرس يدعم الاستعلامات الجزئية**
   - ✅ `{ published: true }` → يستخدم الفهرس
   - ✅ `{ published: true, meter: 'الطويل' }` → يستخدم الفهرس
   - ✅ `{ published: true, meter: 'الطويل', poemType: 'كاملة' }` → يستخدم الفهرس
   - ❌ `{ poemType: 'كاملة' }` → لا يستخدم الفهرس (يبدأ بـ meter)

4. **حجم الفهرس**
   - الفهرس الجزئي يوفر مساحة (يفهرس فقط القصائد المنشورة)
   - حساب الحجم: `db.poems.stats().indexSizes.idx_meter_type_createdAt_pubTrue`

---

## 🚀 الخطوات التالية

1. ✅ قم بتشغيل `npm run sync:indexes`
2. ✅ قم بتشغيل `npm run clean:fields` (مرة واحدة)
3. ✅ اختبر الاستعلامات باستخدام Postman
4. ✅ راقب الأداء باستخدام `explain()`
5. ✅ تحقق من لوجات Railway بعد النشر

---

تم إنشاء هذا الدليل في: **أكتوبر 2025**  
الإصدار: **1.0**

