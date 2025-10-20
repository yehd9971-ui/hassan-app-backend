import { z } from 'zod';

// مخطط إنشاء قصيدة
export const CreatePoemSchema = z.object({
  title: z.string()
    .min(1, 'العنوان مطلوب')
    .max(150, 'العنوان يجب أن يكون أقل من 150 حرف'),
  text: z.string()
    .min(1, 'نص القصيدة مطلوب')
    .max(20000, 'نص القصيدة يجب أن يكون أقل من 20000 حرف'),
  verses: z.array(z.string().min(1, 'البيت مطلوب'))
    .min(1, 'يجب أن تحتوي القصيدة على بيت واحد على الأقل'),
  poemType: z.enum(['عمودي', 'حر', 'نثر', 'شعبي'])
    .default('عمودي'),
  meter: z.string().optional(),
  rhyme: z.string().optional(),
  date: z.union([z.string().datetime('تاريخ غير صالح'), z.date()]).optional(),
  lineCount: z.number().int().positive('عدد الأسطر يجب أن يكون رقم موجب').optional(),
  published: z.boolean().default(false),
  publishedAt: z.union([z.string().datetime('تاريخ النشر غير صالح'), z.date()]).optional(),
  normalizedText: z.string().optional(),
  tags: z.array(z.string().max(50, 'الوسم يجب أن يكون أقل من 50 حرف'))
    .max(10, 'يمكن إضافة 10 وسوم كحد أقصى')
    .optional()
});

// مخطط تحديث قصيدة
export const UpdatePoemSchema = CreatePoemSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  'يجب تحديث حقل واحد على الأقل'
);

// مخطط قائمة القصائد
export const GetPoemsSchema = z.object({
  page: z.string().regex(/^\d+$/, 'رقم الصفحة غير صالح')
    .transform(Number)
    .refine((n) => n >= 1, 'رقم الصفحة يجب أن يكون 1 أو أكبر')
    .default('1'),
  limit: z.string().regex(/^\d+$/, 'حد الطلبات غير صالح')
    .transform(Number)
    .refine((n) => n >= 1 && n <= 100, 'حد الطلبات يجب أن يكون بين 1 و 100')
    .default('20'),
  q: z.string().optional(),
  tag: z.string().optional(),
  sort: z.enum(['new', 'old']).default('new'),
  type: z.string().optional(),
  published: z.string().regex(/^(true|false)$/).optional()
});

// مخطط البحث
export const SearchPoemsSchema = z.object({
  q: z.string().min(1, 'كلمة البحث مطلوبة'),
  type: z.string().optional(),
  published: z.string().regex(/^(true|false)$/).optional()
});
