# Hassan App - مشروع باك إند متقدم

## نظرة عامة
Hassan App هو مشروع باك إند متقدم مبني باستخدام أحدث التقنيات في تطوير الويب.

## التقنيات المستخدمة
- **Node.js** - بيئة تشغيل JavaScript
- **Express.js** - إطار عمل ويب سريع ومرن
- **TypeScript** - لغة برمجة مطورة من JavaScript
- **MongoDB Atlas** - قاعدة بيانات سحابية
- **MongoDB Driver** - للاتصال بقاعدة البيانات

## الميزات
- ✅ اتصال آمن مع MongoDB Atlas
- ✅ ServerApiVersion.v1 للاستقرار
- ✅ معالجة الأخطاء المتقدمة
- ✅ أمان متقدم (Helmet)
- ✅ دعم CORS
- ✅ تسجيل الطلبات (Morgan)
- ✅ متغيرات البيئة
- ✅ إغلاق آمن للاتصالات

## هيكل المشروع
```
src/
├── config/
│   └── database.ts          # إعدادات قاعدة البيانات
├── routes/
│   ├── test.ts             # routes للاختبار
│   └── hassan-app.ts       # routes الرئيسية للتطبيق
├── models/                 # نماذج البيانات
├── controllers/            # المتحكمات
├── middleware/             # الوسطاء
├── utils/                  # الأدوات المساعدة
└── index.ts               # الملف الرئيسي
```

## الروابط المتاحة

### Hassan App Routes
- **الرئيسي**: http://localhost:3000/hassan-app
- **معلومات التطبيق**: http://localhost:3000/hassan-app/info
- **فحص الصحة**: http://localhost:3000/hassan-app/health
- **المستخدمين**: http://localhost:3000/hassan-app/users (قريباً)
- **المنشورات**: http://localhost:3000/hassan-app/posts (قريباً)

### Test Routes
- **اختبار MongoDB**: http://localhost:3000/test/mongodb
- **إنشاء مستند**: POST http://localhost:3000/test/mongodb/test-document
- **جلب المستندات**: http://localhost:3000/test/mongodb/test-documents

### System Routes
- **الرئيسي**: http://localhost:3000
- **فحص النظام**: http://localhost:3000/health

## التشغيل

### وضع التطوير
```bash
npm run dev
```

### وضع الإنتاج
```bash
npm run build
npm start
```

## حالة النظام
- **الخادم**: يعمل على المنفذ 3000
- **قاعدة البيانات**: متصلة مع MongoDB Atlas
- **الحالة**: نشط ومستقر

## التطوير المستقبلي
هذا المشروع جاهز لإضافة المزيد من الميزات مثل:
- نماذج البيانات (Models)
- المتحكمات (Controllers)
- المصادقة والتوثيق
- APIs متقدمة
- معالجة الملفات
- إشعارات

---
تم إنشاء المشروع بواسطة: Mohammed
التاريخ: 2025-10-18
