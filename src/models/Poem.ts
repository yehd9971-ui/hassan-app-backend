export interface Poem {
  _id?: string;
  // الحقول الأساسية - اختيارية
  title?: string;
  text?: string;
  verses?: string[];
  poemType?: string;
  meter?: string;
  rhyme?: string;
  date?: any;
  lineCount?: any;
  published?: any;
  publishedAt?: any;
  normalizedText?: string;
  tags?: string[];
  // حقول إضافية مفتوحة
  author?: string;
  language?: string;
  theme?: string;
  mood?: string;
  difficulty?: string;
  readingTime?: any;
  likes?: any;
  views?: any;
  comments?: any[];
  category?: string;
  era?: string;
  region?: string;
  isOriginal?: any;
  source?: string;
  notes?: string;
  // حقل مفتوح لأي بيانات إضافية
  customData?: Record<string, any>;
  // حقول النظام
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePoemRequest {
  // جميع الحقول اختيارية - بدون قيود
  title?: string;
  text?: string;
  verses?: string[];
  poemType?: string;
  meter?: string;
  rhyme?: string;
  date?: any;
  lineCount?: any;
  published?: any;
  publishedAt?: any;
  normalizedText?: string;
  tags?: string[];
  // حقول إضافية مفتوحة
  author?: string;
  language?: string;
  theme?: string;
  mood?: string;
  difficulty?: string;
  readingTime?: any;
  likes?: any;
  views?: any;
  comments?: any[];
  category?: string;
  era?: string;
  region?: string;
  isOriginal?: any;
  source?: string;
  notes?: string;
  // حقل مفتوح لأي بيانات إضافية
  customData?: Record<string, any>;
}

export interface UpdatePoemRequest extends Partial<CreatePoemRequest> {
  _id: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PoemResponse {
  success: boolean;
  message: string;
  data?: Poem | Poem[] | any; // السماح بأي نوع من البيانات للإحصائيات
  count?: number;
  pagination?: PaginationInfo;
  error?: string;
}
