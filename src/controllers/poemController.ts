import { Request, Response } from 'express';
import database from '../config/database';
import { Poem, CreatePoemRequest, PoemResponse } from '../models/Poem';
import { ObjectId } from 'mongodb';
import { METERS, TYPES } from '../schemas/poemSchemas';
import { ERROR_MESSAGES, ERROR_CODES, createErrorResponse, createSuccessResponse } from '../utils/errorMessages';
import { CacheManager } from '../utils/cacheManager';

export class PoemController {
  private collection = 'poems';

  // إنشاء قصيدة جديدة - بدون قيود
  async createPoem(req: Request, res: Response): Promise<void> {
    try {
      const poemData: any = req.body; // قبول أي بيانات
      
      const db = database.getDatabase();
      const poemsCollection = db.collection(this.collection);

      // إعداد البيانات - قبول جميع الحقول كما هي
      const newPoem: any = {
        ...poemData, // نسخ جميع البيانات المرسلة
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await poemsCollection.insertOne(newPoem);
      const createdPoem = await poemsCollection.findOne({ _id: result.insertedId });

      // إبطال الكاش فوراً
      await CacheManager.invalidateAll();

      const response = createSuccessResponse(
        'تم إنشاء القصيدة بنجاح',
        createdPoem as unknown as Poem,
        201
      );

      res.status(201).json(response);
    } catch (error) {
      console.error('خطأ في إنشاء القصيدة:', error);
      const response = createErrorResponse(
        ERROR_MESSAGES.POEM_CREATE_FAILED,
        ERROR_CODES.POEM_CREATE_FAILED,
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(response);
    }
  }

  // استخدام القوائم من schemas
  private readonly METERS = METERS;
  private readonly TYPES = TYPES;

  // جلب جميع القصائد مع فلترة دقيقة تطابق الفهرس المركب
  async getAllPoems(req: Request, res: Response): Promise<void> {
    try {
      // قراءة المعاملات
      const publishedParam = String(req.query.published ?? 'true').toLowerCase();
      const meterParam = req.query.meter ? String(req.query.meter).trim() : undefined;
      const poemTypeParam = req.query.poemType ? String(req.query.poemType).trim() : undefined;
      const sortParam = req.query.sort as string || 'new';
      const beforeParam = req.query.before ? String(req.query.before) : undefined;
      const limitParam = Math.min(Number(req.query.limit) || 50, 150);

      // التحقق من صحة meter
      if (meterParam && !this.METERS.includes(meterParam as any)) {
        const response = createErrorResponse(
          `${ERROR_MESSAGES.INVALID_METER}. القيم المسموح بها: ${this.METERS.join('، ')}`,
          ERROR_CODES.INVALID_METER,
          400,
          { provided: meterParam, allowed: this.METERS }
        );
        res.status(400).json(response);
        return;
      }

      // التحقق من صحة poemType
      if (poemTypeParam && !this.TYPES.includes(poemTypeParam as any)) {
        const response = createErrorResponse(
          `${ERROR_MESSAGES.INVALID_POEM_TYPE}. القيم المسموح بها: ${this.TYPES.join('، ')}`,
          ERROR_CODES.INVALID_POEM_TYPE,
          400,
          { provided: poemTypeParam, allowed: this.TYPES }
        );
        res.status(400).json(response);
        return;
      }

      // التحقق من صحة sort
      if (sortParam !== 'new' && sortParam !== 'old') {
        const response = createErrorResponse(
          `${ERROR_MESSAGES.INVALID_SORT}. القيم المسموح بها: new, old`,
          ERROR_CODES.INVALID_SORT,
          400,
          { provided: sortParam, allowed: ['new', 'old'] }
        );
        res.status(400).json(response);
        return;
      }

      const db = database.getDatabase();
      const poemsCollection = db.collection(this.collection);

      // بناء الفلتر يطابق الفهرس المركب
      const filter: any = { 
        published: publishedParam === 'true' 
      };

      // إضافة meter فقط إن وُجد
      if (meterParam) {
        filter.meter = meterParam;
      }

      // إضافة poemType فقط إن وُجد
      if (poemTypeParam) {
        filter.poemType = poemTypeParam;
      }

      // إضافة cursor-based pagination
      if (beforeParam) {
        try {
          const beforeDate = new Date(beforeParam);
          filter.createdAt = { 
            [sortParam === 'new' ? '$lt' : '$gt']: beforeDate 
          };
        } catch (e) {
          const response = createErrorResponse(
            `${ERROR_MESSAGES.INVALID_DATE}. استخدم ISO 8601 format`,
            ERROR_CODES.INVALID_DATE,
            400,
            { provided: beforeParam, expected: 'ISO 8601 format' }
          );
          res.status(400).json(response);
          return;
        }
      }

      // بناء ترتيب يطابق الفهرس
      const sortDoc = { 
        createdAt: sortParam === 'new' ? -1 : 1 
      } as const;

      // تنفيذ الاستعلام بكفاءة
      const [items, matched] = await Promise.all([
        poemsCollection
          .find(filter)
          .sort(sortDoc)
          .limit(limitParam)
          .toArray(),
        poemsCollection.countDocuments(filter)
      ]);

      const response = createSuccessResponse(
        `تم العثور على ${items.length} قصيدة من أصل ${matched}`,
        items as unknown as Poem[],
        200,
        {
          count: items.length,
          pagination: {
            page: 1,
            limit: limitParam,
            totalCount: matched,
            totalPages: Math.ceil(matched / limitParam),
            hasNext: items.length === limitParam && items.length < matched,
            hasPrev: false
          }
        }
      );

      res.json(response);
    } catch (error) {
      console.error('خطأ في جلب القصائد:', error);
      const response = createErrorResponse(
        ERROR_MESSAGES.POEM_FETCH_FAILED,
        ERROR_CODES.POEM_FETCH_FAILED,
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(response);
    }
  }

  // جلب قصيدة بالمعرف
  async getPoemById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const db = database.getDatabase();
      const poemsCollection = db.collection(this.collection);
      
      const poem = await poemsCollection.findOne({ _id: new ObjectId(id) });
      
      if (!poem) {
        const response: PoemResponse = {
          success: false,
          message: 'القصيدة غير موجودة',
          error: 'Poem not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: PoemResponse = {
        success: true,
        message: 'تم العثور على القصيدة',
        data: poem as unknown as Poem
      };

      res.json(response);
    } catch (error) {
      console.error('خطأ في جلب القصيدة:', error);
      const response: PoemResponse = {
        success: false,
        message: 'خطأ في جلب القصيدة',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  // تحديث قصيدة
  async updatePoem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const db = database.getDatabase();
      const poemsCollection = db.collection(this.collection);
      
      // إضافة تاريخ التحديث
      updateData.updatedAt = new Date();
      
      const result = await poemsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        const response = createErrorResponse(
          ERROR_MESSAGES.POEM_NOT_FOUND,
          ERROR_CODES.POEM_NOT_FOUND,
          404
        );
        res.status(404).json(response);
        return;
      }

      // إبطال الكاش فوراً
      await CacheManager.invalidatePoem(id);

      const updatedPoem = await poemsCollection.findOne({ _id: new ObjectId(id) });
      
      const response = createSuccessResponse(
        'تم تحديث القصيدة بنجاح',
        updatedPoem as unknown as Poem
      );

      res.json(response);
    } catch (error) {
      console.error('خطأ في تحديث القصيدة:', error);
      const response = createErrorResponse(
        ERROR_MESSAGES.POEM_UPDATE_FAILED,
        ERROR_CODES.POEM_UPDATE_FAILED,
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(response);
    }
  }

  // حذف قصيدة
  async deletePoem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const db = database.getDatabase();
      const poemsCollection = db.collection(this.collection);
      
      const result = await poemsCollection.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        const response = createErrorResponse(
          ERROR_MESSAGES.POEM_NOT_FOUND,
          ERROR_CODES.POEM_NOT_FOUND,
          404
        );
        res.status(404).json(response);
        return;
      }

      // إبطال الكاش فوراً
      await CacheManager.invalidateAll();

      const response = createSuccessResponse(
        'تم حذف القصيدة بنجاح'
      );

      res.json(response);
    } catch (error) {
      console.error('خطأ في حذف القصيدة:', error);
      const response = createErrorResponse(
        ERROR_MESSAGES.POEM_DELETE_FAILED,
        ERROR_CODES.POEM_DELETE_FAILED,
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(response);
    }
  }

  // البحث في القصائد مع pagination محسّن
  async searchPoems(req: Request, res: Response): Promise<void> {
    try {
      const { q, type, published, page = '1', limit = '20' } = req.query;
      const db = database.getDatabase();
      const poemsCollection = db.collection(this.collection);
      
      // تحويل المعاملات
      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));
      const skip = (pageNum - 1) * limitNum;
      
      let filter: any = {};
      
      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { text: { $regex: q, $options: 'i' } },
          { normalizedText: { $regex: q, $options: 'i' } }
        ];
      }
      
      if (type) {
        filter.poemType = type;
      }
      
      if (published !== undefined) {
        filter.published = published === 'true';
      }
      
      // تنفيذ الاستعلام مع pagination
      const [poems, totalCount] = await Promise.all([
        poemsCollection
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .toArray(),
        poemsCollection.countDocuments(filter)
      ]);
      
      const response = createSuccessResponse(
        `تم العثور على ${poems.length} قصيدة من أصل ${totalCount}`,
        poems as unknown as Poem[],
        200,
        {
          count: poems.length,
          pagination: {
            page: pageNum,
            limit: limitNum,
            totalCount,
            totalPages: Math.ceil(totalCount / limitNum),
            hasNext: pageNum < Math.ceil(totalCount / limitNum),
            hasPrev: pageNum > 1
          },
          searchQuery: {
            q: q || null,
            type: type || null,
            published: published || null
          }
        }
      );

      res.json(response);
    } catch (error) {
      console.error('خطأ في البحث:', error);
      const response = createErrorResponse(
        ERROR_MESSAGES.SEARCH_FAILED,
        ERROR_CODES.SEARCH_FAILED,
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(response);
    }
  }
}
