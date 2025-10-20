# API Versioning Implementation

## Overview
تم تطبيق API Versioning على المشروع الحالي لإضافة مسارات منسقة للنسخة الأولى من API.

## Changes Made

### 1. New Files Created

#### `src/routes/v1/poems.ts`
- نسخة من راوتر القصائد الأصلي
- نفس الوظائف والميدلويرات
- مسارات: `/api/v1/poems/*`

#### `src/routes/index.ts`
- مجمع المسارات الرئيسي للـ API
- يضيف header `X-API-Version: v1`
- يربط مسارات النسخة الأولى

### 2. Modified Files

#### `src/index.ts`
```diff
+ import apiRoutes from './routes/index';

// Hassan App routes
app.use('/hassan-app', hassanAppRoutes);

+ // API Versioned routes
+ app.use('/api', apiRoutes);

- // Poems routes
- app.use('/poems', poemRoutes);
+ // Legacy poems routes (deprecated) - redirect to v1
+ app.use('/poems', (req, res) => {
+   res.setHeader('Deprecation', 'true'); // RFC 8594
+   res.setHeader('Sunset', 'Tue, 30 Dec 2025 23:59:59 GMT');
+   res.redirect(308, '/api/v1/poems' + req.url);
+ });
```

## API Endpoints

### New v1 Endpoints
- `GET /api/v1/poems` - جلب جميع القصائد
- `POST /api/v1/poems` - إنشاء قصيدة جديدة
- `GET /api/v1/poems/:id` - جلب قصيدة بالمعرف
- `PUT /api/v1/poems/:id` - تحديث قصيدة
- `DELETE /api/v1/poems/:id` - حذف قصيدة
- `GET /api/v1/poems/search` - البحث في القصائد

### Legacy Endpoints (Deprecated)
- `GET /poems` → Redirects to `/api/v1/poems`
- `POST /poems` → Redirects to `/api/v1/poems`
- All other `/poems/*` → Redirects to `/api/v1/poems/*`

## Features

### 1. API Version Header
جميع طلبات `/api/v1/*` تحتوي على header:
```
X-API-Version: v1
```

### 2. Backward Compatibility
- المسارات القديمة تعيد توجيه 308 إلى النسخة الجديدة
- ترويسات Deprecation و Sunset للتنبيه
- لا كسر في الوظائف الموجودة

### 3. Same Middleware Stack
- نفس الميدلويرات الأمنية
- نفس التحقق من البيانات
- نفس نظام المصادقة والصلاحيات

## Testing

### Manual Tests
1. **v1 API Works**: `GET /api/v1/poems` returns 200 with `X-API-Version: v1`
2. **Legacy Redirect**: `GET /poems` returns 308 redirect to `/api/v1/poems`
3. **Authentication**: All protected endpoints require valid JWT token
4. **Same Functionality**: All CRUD operations work as before

### Test Results
✅ v1 API endpoint responds correctly  
✅ API version header present  
✅ Legacy redirect works (308)  
✅ Authentication required for protected endpoints  
✅ All middleware preserved  

## Migration Guide

### For API Consumers
1. **Update base URL**: Change from `/poems` to `/api/v1/poems`
2. **Check headers**: Look for `X-API-Version: v1` in responses
3. **Handle redirects**: Legacy URLs will redirect automatically
4. **Update by December 2025**: Legacy endpoints will be removed

### For Developers
1. **New endpoints**: Use `/api/v1/poems` for new features
2. **Version management**: Add new versions in `src/routes/v2/` when needed
3. **Deprecation**: Use same pattern for future version changes

## File Structure
```
src/
├── routes/
│   ├── index.ts          # Main API router
│   ├── v1/
│   │   └── poems.ts      # v1 poems routes
│   ├── poems.ts          # Legacy routes (redirects)
│   └── hassan-app.ts     # Unchanged
├── controllers/          # Unchanged
├── middleware/           # Unchanged
└── index.ts             # Modified
```

## Benefits
1. **Clear Versioning**: Easy to identify API version
2. **Backward Compatible**: No breaking changes
3. **Future Ready**: Easy to add v2, v3, etc.
4. **Standards Compliant**: Follows RFC 8594 for deprecation
5. **Minimal Changes**: Only necessary files modified
