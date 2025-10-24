import { Request, Response } from 'express';
import database from '../config/database';
import { Poem, CreatePoemRequest, PoemResponse } from '../models/Poem';
import { ObjectId } from 'mongodb';

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

      const response: PoemResponse = {
        success: true,
        message: 'تم إنشاء القصيدة بنجاح',
        data: createdPoem as unknown as Poem
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('خطأ في إنشاء القصيدة:', error);
      const response: PoemResponse = {
        success: false,
        message: 'خطأ في إنشاء القصيدة',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  // قوائم القيم المسموح بها
  private readonly METERS = [
    'الطويل', 'المديد', 'البسيط', 'الوافر', 'الكامل', 'الهزج',
    'الرجز', 'الرمل', 'السريع', 'المنسرح', 'الخفيف', 'المضارع',
    'المقتضب', 'المجتث', 'المتقارب', 'المتدارك'
  ] as const;

  private readonly TYPES = [
    'كاملة', 'رباعية', 'ثلاثية', 'ثنائية', 'يتيم'
  ] as const;

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
        const response: PoemResponse = {
          success: false,
          message: `البحر "${meterParam}" غير صالح. القيم المسموح بها: ${this.METERS.join('، ')}`,
          error: 'VALIDATION_ERROR'
        };
        res.status(400).json(response);
        return;
      }

      // التحقق من صحة poemType
      if (poemTypeParam && !this.TYPES.includes(poemTypeParam as any)) {
        const response: PoemResponse = {
          success: false,
          message: `نوع القصيدة "${poemTypeParam}" غير صالح. القيم المسموح بها: ${this.TYPES.join('، ')}`,
          error: 'VALIDATION_ERROR'
        };
        res.status(400).json(response);
        return;
      }

      // التحقق من صحة sort
      if (sortParam !== 'new' && sortParam !== 'old') {
        const response: PoemResponse = {
          success: false,
          message: `قيمة الترتيب "${sortParam}" غير صالحة. القيم المسموح بها: new, old`,
          error: 'VALIDATION_ERROR'
        };
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
          const response: PoemResponse = {
            success: false,
            message: 'تاريخ "before" غير صالح. استخدم ISO 8601 format',
            error: 'VALIDATION_ERROR'
          };
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

      const response: PoemResponse = {
        success: true,
        message: `تم العثور على ${items.length} قصيدة من أصل ${matched}`,
        data: items as unknown as Poem[],
        count: items.length,
        pagination: {
          page: 1,
          limit: limitParam,
          totalCount: matched,
          totalPages: Math.ceil(matched / limitParam),
          hasNext: items.length === limitParam && items.length < matched,
          hasPrev: false
        }
      };

      res.json(response);
    } catch (error) {
      console.error('خطأ في جلب القصائد:', error);
      const response: PoemResponse = {
        success: false,
        message: 'خطأ في جلب القصائد',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
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
        const response: PoemResponse = {
          success: false,
          message: 'القصيدة غير موجودة',
          error: 'Poem not found'
        };
        res.status(404).json(response);
        return;
      }

      const updatedPoem = await poemsCollection.findOne({ _id: new ObjectId(id) });
      
      const response: PoemResponse = {
        success: true,
        message: 'تم تحديث القصيدة بنجاح',
        data: updatedPoem as unknown as Poem
      };

      res.json(response);
    } catch (error) {
      console.error('خطأ في تحديث القصيدة:', error);
      const response: PoemResponse = {
        success: false,
        message: 'خطأ في تحديث القصيدة',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
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
        message: 'تم حذف القصيدة بنجاح'
      };

      res.json(response);
    } catch (error) {
      console.error('خطأ في حذف القصيدة:', error);
      const response: PoemResponse = {
        success: false,
        message: 'خطأ في حذف القصيدة',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  // البحث في القصائد
  async searchPoems(req: Request, res: Response): Promise<void> {
    try {
      const { q, type, published } = req.query;
      const db = database.getDatabase();
      const poemsCollection = db.collection(this.collection);
      
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
      
      const poems = await poemsCollection.find(filter).sort({ createdAt: -1 }).toArray();
      
      const response: PoemResponse = {
        success: true,
        message: `تم العثور على ${poems.length} قصيدة`,
        data: poems as unknown as Poem[],
        count: poems.length
      };

      res.json(response);
    } catch (error) {
      console.error('خطأ في البحث:', error);
      const response: PoemResponse = {
        success: false,
        message: 'خطأ في البحث',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }
}
