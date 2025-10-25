import { Router } from 'express';
import { HealthController } from '../controllers/healthController';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const healthController = new HealthController();

// فحص صحة الخادم الأساسي
router.get('/',
  asyncHandler((req, res) => healthController.basicHealth(req, res))
);

// فحص صحة قاعدة البيانات
router.get('/database',
  asyncHandler((req, res) => healthController.databaseHealth(req, res))
);

// فحص صحة الكاش
router.get('/cache',
  asyncHandler((req, res) => healthController.cacheHealth(req, res))
);

// فحص شامل للصحة
router.get('/comprehensive',
  asyncHandler((req, res) => healthController.comprehensiveHealth(req, res))
);

// فحص صحة الـ API endpoints
router.get('/api',
  asyncHandler((req, res) => healthController.apiHealth(req, res))
);

export default router;
