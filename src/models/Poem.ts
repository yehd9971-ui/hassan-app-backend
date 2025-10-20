export interface Poem {
  _id?: string;
  title: string;
  text: string;
  verses: string[];
  poemType: 'عمودي' | 'حر' | 'نثر' | 'شعبي';
  meter: string;
  rhyme: string;
  date: Date;
  lineCount: number;
  published: boolean;
  publishedAt?: Date;
  normalizedText: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePoemRequest {
  title: string;
  text: string;
  verses: string[];
  poemType: 'عمودي' | 'حر' | 'نثر' | 'شعبي';
  meter: string;
  rhyme: string;
  date: string; // ISO string
  lineCount: number;
  published: boolean;
  publishedAt?: string; // ISO string
  normalizedText: string;
  tags?: string[];
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
  data?: Poem | Poem[];
  count?: number;
  pagination?: PaginationInfo;
  error?: string;
}
