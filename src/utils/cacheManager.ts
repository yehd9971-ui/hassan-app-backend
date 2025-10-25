import { createClient } from 'redis';

// إعداد Redis client
let redisClient: any = null;

// تهيئة Redis
export const initCacheManager = async (): Promise<any> => {
  if (process.env.REDIS_URL) {
    try {
      redisClient = createClient({ url: process.env.REDIS_URL });
      await redisClient.connect();
      console.log('✅ تم الاتصال بـ Redis للكاش بنجاح');
      return redisClient;
    } catch (error) {
      console.warn('⚠️ فشل الاتصال بـ Redis للكاش، سيتم استخدام in-memory cache:', error);
      return null;
    }
  }
  return null;
};

// إغلاق اتصال Redis
export const closeCacheManager = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    console.log('🔌 تم إغلاق اتصال Redis للكاش');
  }
};

// Cache Manager class
export class CacheManager {
  private static readonly CACHE_KEYS = {
    STATS_OVERVIEW: 'stats:overview',
    STATS_METERS: 'stats:meters',
    STATS_TYPES: 'stats:types',
    POEMS_ALL: 'poems:all',
    POEMS_SEARCH: 'poems:search',
    POEMS_METER: 'poems:meter',
    POEMS_TYPE: 'poems:type'
  } as const;

  private static readonly CACHE_TTL = {
    STATS: 600, // 10 دقائق
    POEMS: 300, // 5 دقائق
    SEARCH: 120 // دقيقتان
  } as const;

  // إبطال كاش الإحصائيات
  static async invalidateStats(): Promise<void> {
    if (!redisClient) return;

    try {
      const keys = [
        this.CACHE_KEYS.STATS_OVERVIEW,
        this.CACHE_KEYS.STATS_METERS,
        this.CACHE_KEYS.STATS_TYPES
      ];

      await Promise.all(keys.map(key => redisClient.del(key)));
      console.log('🗑️ تم إبطال كاش الإحصائيات');
    } catch (error) {
      console.error('❌ خطأ في إبطال كاش الإحصائيات:', error);
    }
  }

  // إبطال كاش القصائد
  static async invalidatePoems(): Promise<void> {
    if (!redisClient) return;

    try {
      const keys = [
        this.CACHE_KEYS.POEMS_ALL,
        this.CACHE_KEYS.POEMS_SEARCH,
        this.CACHE_KEYS.POEMS_METER,
        this.CACHE_KEYS.POEMS_TYPE
      ];

      await Promise.all(keys.map(key => redisClient.del(key)));
      console.log('🗑️ تم إبطال كاش القصائد');
    } catch (error) {
      console.error('❌ خطأ في إبطال كاش القصائد:', error);
    }
  }

  // إبطال كاش قصيدة محددة
  static async invalidatePoem(poemId: string): Promise<void> {
    if (!redisClient) return;

    try {
      const keys = [
        `poems:${poemId}`,
        this.CACHE_KEYS.POEMS_ALL,
        this.CACHE_KEYS.STATS_OVERVIEW
      ];

      await Promise.all(keys.map(key => redisClient.del(key)));
      console.log(`🗑️ تم إبطال كاش القصيدة ${poemId}`);
    } catch (error) {
      console.error('❌ خطأ في إبطال كاش القصيدة:', error);
    }
  }

  // إبطال جميع الكاش
  static async invalidateAll(): Promise<void> {
    if (!redisClient) return;

    try {
      await Promise.all([
        this.invalidateStats(),
        this.invalidatePoems()
      ]);
      console.log('🗑️ تم إبطال جميع الكاش');
    } catch (error) {
      console.error('❌ خطأ في إبطال جميع الكاش:', error);
    }
  }

  // الحصول على البيانات من الكاش
  static async get(key: string): Promise<any> {
    if (!redisClient) return null;

    try {
      const cached = await redisClient.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('❌ خطأ في جلب البيانات من الكاش:', error);
      return null;
    }
  }

  // حفظ البيانات في الكاش
  static async set(key: string, data: any, ttl: number = 300): Promise<void> {
    if (!redisClient) return;

    try {
      await redisClient.setex(key, ttl, JSON.stringify(data));
      console.log(`💾 تم حفظ البيانات في الكاش: ${key}`);
    } catch (error) {
      console.error('❌ خطأ في حفظ البيانات في الكاش:', error);
    }
  }

  // حفظ كاش الإحصائيات
  static async setStats(key: string, data: any): Promise<void> {
    await this.set(key, data, this.CACHE_TTL.STATS);
  }

  // حفظ كاش القصائد
  static async setPoems(key: string, data: any): Promise<void> {
    await this.set(key, data, this.CACHE_TTL.POEMS);
  }

  // حفظ كاش البحث
  static async setSearch(key: string, data: any): Promise<void> {
    await this.set(key, data, this.CACHE_TTL.SEARCH);
  }

  // إنشاء مفتاح كاش للبحث
  static createSearchKey(query: any): string {
    const sortedQuery = Object.keys(query)
      .sort()
      .reduce((result, key) => {
        result[key] = query[key];
        return result;
      }, {} as any);
    
    return `search:${Buffer.from(JSON.stringify(sortedQuery)).toString('base64')}`;
  }

  // إنشاء مفتاح كاش للفلترة
  static createFilterKey(filter: any): string {
    const sortedFilter = Object.keys(filter)
      .sort()
      .reduce((result, key) => {
        result[key] = filter[key];
        return result;
      }, {} as any);
    
    return `filter:${Buffer.from(JSON.stringify(sortedFilter)).toString('base64')}`;
  }

  // تنظيف الكاش المنتهي الصلاحية
  static async cleanup(): Promise<void> {
    if (!redisClient) return;

    try {
      // يمكن إضافة منطق تنظيف الكاش هنا
      console.log('🧹 تم تنظيف الكاش المنتهي الصلاحية');
    } catch (error) {
      console.error('❌ خطأ في تنظيف الكاش:', error);
    }
  }

  // إحصائيات الكاش
  static async getStats(): Promise<any> {
    if (!redisClient) return null;

    try {
      const info = await redisClient.info('memory');
      const keyspace = await redisClient.info('keyspace');
      
      return {
        memory: info,
        keyspace: keyspace,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ خطأ في جلب إحصائيات الكاش:', error);
      return null;
    }
  }
}
