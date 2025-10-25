import { Request, Response } from 'express';
import database from '../config/database';
import { PoemResponse } from '../models/Poem';

export class StatsController {
  private collection = 'poems';

  // إحصائيات شاملة
  async getOverview(req: Request, res: Response): Promise<void> {
    try {
      const db = database.getDatabase();
      const poemsCollection = db.collection(this.collection);

      // إحصائيات عامة
      const totalPoems = await poemsCollection.countDocuments({});
      const publishedPoems = await poemsCollection.countDocuments({ published: true });

      // إحصائيات البحور
      const metersStats = await poemsCollection.aggregate([
        { $match: { published: true, meter: { $exists: true, $ne: null } } },
        { $group: { _id: '$meter', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray();

      // إحصائيات الأنواع
      const typesStats = await poemsCollection.aggregate([
        { $match: { published: true, poemType: { $exists: true, $ne: null } } },
        { $group: { _id: '$poemType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray();

      // تحويل النتائج إلى كائن
      const meters = metersStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>);

      const types = typesStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>);

      const response: PoemResponse = {
        success: true,
        message: 'تم جلب الإحصائيات الشاملة بنجاح',
        data: {
          totalPoems,
          publishedPoems,
          meters,
          types,
          lastUpdated: new Date().toISOString()
        }
      };

      res.json(response);
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات الشاملة:', error);
      const response: PoemResponse = {
        success: false,
        message: 'خطأ في جلب الإحصائيات الشاملة',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  // إحصائيات بحر معين
  async getMeterStats(req: Request, res: Response): Promise<void> {
    try {
      const { meter } = req.params;
      const { poemType, published = 'true' } = req.query;

      const db = database.getDatabase();
      const poemsCollection = db.collection(this.collection);

      // بناء الفلتر
      const filter: any = { 
        meter: meter,
        published: published === 'true' 
      };

      if (poemType) {
        filter.poemType = poemType;
      }

      // العدد الإجمالي
      const totalCount = await poemsCollection.countDocuments(filter);

      // تفصيل حسب النوع
      const breakdown = await poemsCollection.aggregate([
        { $match: filter },
        { $group: { _id: '$poemType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray();

      const typeBreakdown = breakdown.reduce((acc, item) => {
        acc[item._id || 'غير محدد'] = item.count;
        return acc;
      }, {} as Record<string, number>);

      const response: PoemResponse = {
        success: true,
        message: `إحصائيات بحر ${meter}`,
        data: {
          meter,
          totalCount,
          breakdown: typeBreakdown,
          filter: {
            published: published === 'true',
            poemType: poemType || 'جميع الأنواع'
          }
        }
      };

      res.json(response);
    } catch (error) {
      console.error('خطأ في جلب إحصائيات البحر:', error);
      const response: PoemResponse = {
        success: false,
        message: 'خطأ في جلب إحصائيات البحر',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  // إحصائيات نوع معين
  async getTypeStats(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const { meter, published = 'true' } = req.query;

      const db = database.getDatabase();
      const poemsCollection = db.collection(this.collection);

      // بناء الفلتر
      const filter: any = { 
        poemType: type,
        published: published === 'true' 
      };

      if (meter) {
        filter.meter = meter;
      }

      // العدد الإجمالي
      const totalCount = await poemsCollection.countDocuments(filter);

      // تفصيل حسب البحر
      const breakdown = await poemsCollection.aggregate([
        { $match: filter },
        { $group: { _id: '$meter', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray();

      const meterBreakdown = breakdown.reduce((acc, item) => {
        acc[item._id || 'غير محدد'] = item.count;
        return acc;
      }, {} as Record<string, number>);

      const response: PoemResponse = {
        success: true,
        message: `إحصائيات نوع ${type}`,
        data: {
          type,
          totalCount,
          breakdown: meterBreakdown,
          filter: {
            published: published === 'true',
            meter: meter || 'جميع البحور'
          }
        }
      };

      res.json(response);
    } catch (error) {
      console.error('خطأ في جلب إحصائيات النوع:', error);
      const response: PoemResponse = {
        success: false,
        message: 'خطأ في جلب إحصائيات النوع',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  // إحصائيات مرنة (الطريقة المفضلة)
  async getFlexibleStats(req: Request, res: Response): Promise<void> {
    try {
      const { meter, poemType, published = 'true', groupBy } = req.query;

      const db = database.getDatabase();
      const poemsCollection = db.collection(this.collection);

      // بناء الفلتر
      const filter: any = { 
        published: published === 'true' 
      };

      if (meter) {
        filter.meter = meter;
      }

      if (poemType) {
        filter.poemType = poemType;
      }

      // العدد الإجمالي
      const totalCount = await poemsCollection.countDocuments(filter);

      let breakdown = {};

      // تجميع حسب المعامل المطلوب
      if (groupBy === 'meter') {
        const result = await poemsCollection.aggregate([
          { $match: filter },
          { $group: { _id: '$meter', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]).toArray();

        breakdown = result.reduce((acc, item) => {
          acc[item._id || 'غير محدد'] = item.count;
          return acc;
        }, {} as Record<string, number>);
      } else if (groupBy === 'poemType') {
        const result = await poemsCollection.aggregate([
          { $match: filter },
          { $group: { _id: '$poemType', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]).toArray();

        breakdown = result.reduce((acc, item) => {
          acc[item._id || 'غير محدد'] = item.count;
          return acc;
        }, {} as Record<string, number>);
      }

      const response: PoemResponse = {
        success: true,
        message: 'تم جلب الإحصائيات بنجاح',
        data: {
          totalCount,
          breakdown,
          filter: {
            meter: meter || 'جميع البحور',
            poemType: poemType || 'جميع الأنواع',
            published: published === 'true'
          },
          groupBy: groupBy || 'none'
        }
      };

      res.json(response);
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
      const response: PoemResponse = {
        success: false,
        message: 'خطأ في جلب الإحصائيات',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }
}
