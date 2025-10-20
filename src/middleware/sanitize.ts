import mongoSanitize from 'express-mongo-sanitize';
import { Request, Response, NextFunction } from 'express';

// تنظيف البيانات من حقن MongoDB
export const sanitizeMongo = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`تم تنظيف حقل ${key} من حقن MongoDB`);
  }
});

// تنظيف انتقائي للبيانات (لا يؤثر على نصوص القصائد)
export const sanitizeSelective = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body) {
    // تنظيف الحقول التي قد تحتوي على HTML ضار
    const fieldsToSanitize = ['title', 'meter', 'rhyme'];
    
    fieldsToSanitize.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        // إزالة HTML tags الضارة فقط
        req.body[field] = req.body[field]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      }
    });
    
    // ترك نص القصيدة كما هو (لا تنظيف)
    // req.body.text و req.body.verses تبقى بدون تغيير
  }
  
  next();
};
