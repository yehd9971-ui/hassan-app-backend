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

  // جلب جميع القصائد مع pagination
  async getAllPoems(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 20, q, tag, sort = 'new', type, published } = req.query;
      
      const db = database.getDatabase();
      const poemsCollection = db.collection(this.collection);
      
      // بناء الفلتر
      let filter: any = {};
      
      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { text: { $regex: q, $options: 'i' } },
          { normalizedText: { $regex: q, $options: 'i' } }
        ];
      }
      
      if (tag) {
        filter.tags = { $in: [tag] };
      }
      
      if (type) {
        filter.poemType = type;
      }
      
      if (published !== undefined) {
        filter.published = published === 'true';
      }
      
      // ترتيب النتائج
      const sortOrder = sort === 'old' ? 1 : -1;
      const sortOptions = { createdAt: sortOrder as 1 | -1 };
      
      // حساب الصفحات
      const skip = (Number(page) - 1) * Number(limit);
      const totalCount = await poemsCollection.countDocuments(filter);
      const totalPages = Math.ceil(totalCount / Number(limit));
      
      // جلب البيانات
      const poems = await poemsCollection
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .toArray();
      
      const response: PoemResponse = {
        success: true,
        message: `تم العثور على ${poems.length} قصيدة من أصل ${totalCount}`,
        data: poems as unknown as Poem[],
        count: poems.length,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalCount,
          totalPages,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1
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
