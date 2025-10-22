import { z } from 'zod';

// مخطط إنشاء قصيدة - بدون قيود
export const CreatePoemSchema = z.object({
  title: z.string().optional(),
  text: z.string().optional(),
  verses: z.array(z.string()).optional(),
  poemType: z.string().optional(),
  meter: z.string().optional(),
  rhyme: z.string().optional(),
  date: z.any().optional(),
  lineCount: z.any().optional(),
  published: z.any().optional(),
  publishedAt: z.any().optional(),
  normalizedText: z.string().optional(),
  tags: z.array(z.string()).optional(),
  // إضافة حقول مفتوحة لأي بيانات إضافية
  author: z.string().optional(),
  language: z.string().optional(),
  theme: z.string().optional(),
  mood: z.string().optional(),
  difficulty: z.string().optional(),
  readingTime: z.any().optional(),
  likes: z.any().optional(),
  views: z.any().optional(),
  comments: z.array(z.any()).optional(),
  category: z.string().optional(),
  era: z.string().optional(),
  region: z.string().optional(),
  isOriginal: z.any().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  // حقل مفتوح لأي بيانات إضافية
  customData: z.record(z.any()).optional()
});

// مخطط تحديث قصيدة - بدون قيود
export const UpdatePoemSchema = CreatePoemSchema.partial();

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
