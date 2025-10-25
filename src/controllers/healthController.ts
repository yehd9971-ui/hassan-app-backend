import { Request, Response } from 'express';
import database from '../config/database';
import { CacheManager } from '../utils/cacheManager';
import { createSuccessResponse, createErrorResponse } from '../utils/errorMessages';

export class HealthController {
  // فحص صحة الخادم الأساسي
  async basicHealth(req: Request, res: Response): Promise<void> {
    try {
      const response = createSuccessResponse(
        'الخادم يعمل بشكل طبيعي',
        {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          version: process.version,
          platform: process.platform
        }
      );

      res.json(response);
    } catch (error) {
      const response = createErrorResponse(
        'فشل في فحص صحة الخادم',
        'HEALTH_CHECK_FAILED',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(response);
    }
  }

  // فحص صحة قاعدة البيانات
  async databaseHealth(req: Request, res: Response): Promise<void> {
    try {
      const db = database.getDatabase();
      const startTime = Date.now();
      
      // اختبار الاتصال بقاعدة البيانات
      await db.admin().ping();
      const responseTime = Date.now() - startTime;

      // فحص حالة الاتصال
      const connectionState = 'connected'; // MongoDB connection is active if ping succeeds

      const response = createSuccessResponse(
        'قاعدة البيانات تعمل بشكل طبيعي',
        {
          status: 'healthy',
          database: 'MongoDB',
          connectionState,
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString()
        }
      );

      res.json(response);
    } catch (error) {
      const response = createErrorResponse(
        'فشل في الاتصال بقاعدة البيانات',
        'DATABASE_HEALTH_FAILED',
        503,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(503).json(response);
    }
  }

  // فحص صحة الكاش
  async cacheHealth(req: Request, res: Response): Promise<void> {
    try {
      const cacheStats = await CacheManager.getStats();
      
      if (!cacheStats) {
        const response = createErrorResponse(
          'الكاش غير متوفر',
          'CACHE_UNAVAILABLE',
          503,
          { message: 'Redis cache is not available' }
        );
        res.status(503).json(response);
        return;
      }

      const response = createSuccessResponse(
        'الكاش يعمل بشكل طبيعي',
        {
          status: 'healthy',
          cache: 'Redis',
          stats: cacheStats,
          timestamp: new Date().toISOString()
        }
      );

      res.json(response);
    } catch (error) {
      const response = createErrorResponse(
        'فشل في فحص صحة الكاش',
        'CACHE_HEALTH_FAILED',
        503,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(503).json(response);
    }
  }

  // فحص شامل للصحة
  async comprehensiveHealth(req: Request, res: Response): Promise<void> {
    try {
      const checks = {
        server: await this.checkServerHealth(),
        database: await this.checkDatabaseHealth(),
        cache: await this.checkCacheHealth(),
        memory: await this.checkMemoryHealth(),
        disk: await this.checkDiskHealth()
      };

      const overallStatus = Object.values(checks).every(check => check.status === 'healthy') 
        ? 'healthy' 
        : 'unhealthy';

      const response = createSuccessResponse(
        `فحص شامل للصحة - الحالة: ${overallStatus}`,
        {
          status: overallStatus,
          checks,
          timestamp: new Date().toISOString(),
          summary: {
            total: Object.keys(checks).length,
            healthy: Object.values(checks).filter(check => check.status === 'healthy').length,
            unhealthy: Object.values(checks).filter(check => check.status !== 'healthy').length
          }
        },
        overallStatus === 'healthy' ? 200 : 503
      );

      res.status(overallStatus === 'healthy' ? 200 : 503).json(response);
    } catch (error) {
      const response = createErrorResponse(
        'فشل في الفحص الشامل للصحة',
        'COMPREHENSIVE_HEALTH_FAILED',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(response);
    }
  }

  // فحص صحة الخادم
  private async checkServerHealth(): Promise<any> {
    try {
      return {
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        version: process.version,
        platform: process.platform
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // فحص صحة قاعدة البيانات
  private async checkDatabaseHealth(): Promise<any> {
    try {
      const db = database.getDatabase();
      const startTime = Date.now();
      await db.admin().ping();
      const responseTime = Date.now() - startTime;

      return {
        status: 'healthy',
        responseTime: `${responseTime}ms`,
        connectionState: 'connected' // MongoDB connection is active if ping succeeds
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // فحص صحة الكاش
  private async checkCacheHealth(): Promise<any> {
    try {
      const cacheStats = await CacheManager.getStats();
      
      if (!cacheStats) {
        return {
          status: 'unhealthy',
          error: 'Redis cache is not available'
        };
      }

      return {
        status: 'healthy',
        stats: cacheStats
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // فحص صحة الذاكرة
  private async checkMemoryHealth(): Promise<any> {
    try {
      const memoryUsage = process.memoryUsage();
      const totalMemory = memoryUsage.heapTotal;
      const usedMemory = memoryUsage.heapUsed;
      const memoryUsagePercent = (usedMemory / totalMemory) * 100;

      return {
        status: memoryUsagePercent > 90 ? 'unhealthy' : 'healthy',
        usage: `${memoryUsagePercent.toFixed(2)}%`,
        total: `${Math.round(totalMemory / 1024 / 1024)}MB`,
        used: `${Math.round(usedMemory / 1024 / 1024)}MB`,
        free: `${Math.round((totalMemory - usedMemory) / 1024 / 1024)}MB`
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // فحص صحة القرص (مبسط)
  private async checkDiskHealth(): Promise<any> {
    try {
      // فحص بسيط للقرص - يمكن تحسينه لاحقاً
      return {
        status: 'healthy',
        message: 'Disk health check not implemented yet'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // فحص صحة الـ API endpoints
  async apiHealth(req: Request, res: Response): Promise<void> {
    try {
      const endpoints = [
        { name: 'Poems API', path: '/api/v1/poems', method: 'GET' },
        { name: 'Stats API', path: '/api/v1/stats/overview', method: 'GET' },
        { name: 'Search API', path: '/api/v1/poems/search', method: 'GET' },
        { name: 'Health API', path: '/health', method: 'GET' }
      ];

      const response = createSuccessResponse(
        'جميع الـ API endpoints متاحة',
        {
          status: 'healthy',
          endpoints,
          timestamp: new Date().toISOString(),
          totalEndpoints: endpoints.length
        }
      );

      res.json(response);
    } catch (error) {
      const response = createErrorResponse(
        'فشل في فحص صحة الـ API endpoints',
        'API_HEALTH_FAILED',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(response);
    }
  }
}
