# 🧪 اختبارات API - Index Optimization Tests

## ✅ اختبارات ناجحة (يجب أن تعمل)

### 1. جميع القصائد المنشورة
```bash
GET http://localhost:3000/api/v1/poems?published=true&limit=20
```
**النتيجة المتوقعة:** 
- ✅ `success: true`
- ✅ `message: "تم العثور على X قصيدة من أصل Y"`
- ✅ استخدام الفهرس `idx_meter_type_createdAt_pubTrue`

### 2. فلترة بالبحر فقط
```bash
GET http://localhost:3000/api/v1/poems?published=true&meter=الطويل&limit=10
```
**النتيجة المتوقعة:**
- ✅ قصائد من بحر الطويل فقط
- ✅ استخدام الفهرس

### 3. فلترة بالنوع فقط
```bash
GET http://localhost:3000/api/v1/poems?published=true&poemType=رباعية&limit=10
```
**النتيجة المتوقعة:**
- ✅ قصائد رباعية فقط
- ❌ لن يستخدم الفهرس (لأن poemType ليس أول حقل في الفهرس)

### 4. فلترة بالبحر والنوع معاً
```bash
GET http://localhost:3000/api/v1/poems?published=true&meter=الطويل&poemType=كاملة&limit=10
```
**النتيجة المتوقعة:**
- ✅ قصائد طويلة كاملة فقط
- ✅ استخدام الفهرس بأقصى كفاءة

### 5. ترتيب عكسي (الأقدم أولاً)
```bash
GET http://localhost:3000/api/v1/poems?published=true&sort=old&limit=10
```
**النتيجة المتوقعة:**
- ✅ القصائد القديمة أولاً
- ⚠️ قد لا يستخدم الفهرس (لأن الفهرس مرتب بـ -1 وليس 1)

### 6. Cursor-based pagination
```bash
# الصفحة الأولى
GET http://localhost:3000/api/v1/poems?published=true&meter=الطويل&limit=5&sort=new

# الصفحة التالية (استخدم createdAt من آخر عنصر)
GET http://localhost:3000/api/v1/poems?published=true&meter=الطويل&before=2025-10-24T07:30:00Z&limit=5&sort=new
```
**النتيجة المتوقعة:**
- ✅ pagination فعّالة بدون skip
- ✅ استخدام الفهرس

---

## ❌ اختبارات فاشلة (يجب أن ترجع 400)

### 1. بحر غير صالح
```bash
GET http://localhost:3000/api/v1/poems?published=true&meter=الكويس
```
**النتيجة المتوقعة:**
```json
{
  "success": false,
  "message": "البحر \"الكويس\" غير صالح. القيم المسموح بها: الطويل، المديد، ...",
  "error": "VALIDATION_ERROR"
}
```

### 2. نوع قصيدة غير صالح
```bash
GET http://localhost:3000/api/v1/poems?published=true&poemType=غير_موجود
```
**النتيجة المتوقعة:**
```json
{
  "success": false,
  "message": "نوع القصيدة \"غير_موجود\" غير صالح. القيم المسموح بها: كاملة، رباعية، ...",
  "error": "VALIDATION_ERROR"
}
```

### 3. قيمة sort غير صالحة
```bash
GET http://localhost:3000/api/v1/poems?published=true&sort=random
```
**النتيجة المتوقعة:**
```json
{
  "success": false,
  "message": "قيمة الترتيب \"random\" غير صالحة. القيم المسموح بها: new, old",
  "error": "VALIDATION_ERROR"
}
```

### 4. تاريخ before غير صالح
```bash
GET http://localhost:3000/api/v1/poems?published=true&before=not-a-date
```
**النتيجة المتوقعة:**
```json
{
  "success": false,
  "message": "تاريخ \"before\" غير صالح. استخدم ISO 8601 format",
  "error": "VALIDATION_ERROR"
}
```

---

## 🔍 اختبار الأداء باستخدام MongoDB Explain

### في MongoDB Compass/Shell:

```javascript
// 1. اختبار استعلام بسيط
db.poems.find({
  published: true
}).sort({ createdAt: -1 }).limit(20).explain('executionStats')

// 2. اختبار مع meter
db.poems.find({
  published: true,
  meter: 'الطويل'
}).sort({ createdAt: -1 }).limit(20).explain('executionStats')

// 3. اختبار مع meter + poemType
db.poems.find({
  published: true,
  meter: 'الطويل',
  poemType: 'كاملة'
}).sort({ createdAt: -1 }).limit(20).explain('executionStats')

// 4. اختبار مع cursor
db.poems.find({
  published: true,
  meter: 'الطويل',
  createdAt: { $lt: ISODate('2025-10-24T07:30:00Z') }
}).sort({ createdAt: -1 }).limit(20).explain('executionStats')
```

### ما يجب أن تراه:
```javascript
{
  "executionStats": {
    "executionSuccess": true,
    "nReturned": 20,
    "totalKeysExamined": 20,  // ← يجب أن يساوي nReturned
    "totalDocsExamined": 20,  // ← يجب أن يساوي nReturned
    "executionTimeMillis": 2, // ← أقل من 5ms
    "inputStage": {
      "stage": "IXSCAN",  // ← يستخدم الفهرس ✅
      "indexName": "idx_meter_type_createdAt_pubTrue"
    }
  }
}
```

---

## 📊 اختبارات الإحصائيات

### عرض توزيع البحور
```bash
POST http://localhost:3000/api/v1/poems/stats/meters
```

### عرض توزيع الأنواع
```bash
POST http://localhost:3000/api/v1/poems/stats/types
```

---

## 🎯 معايير النجاح

| المعيار | القيمة المتوقعة |
|---------|-----------------|
| وقت الاستجابة | < 100ms |
| استخدام الفهرس | ✅ IXSCAN |
| totalKeysExamined | ≈ nReturned |
| totalDocsExamined | ≈ nReturned |
| التحقق من البيانات | 400 للقيم غير الصالحة |
| published=true | إجباري للفهرس |

---

تاريخ الإنشاء: **24 أكتوبر 2025**

