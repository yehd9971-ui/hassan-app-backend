import { Router } from 'express';
import { StatsController } from '../../controllers/statsController';
import { validateRequest } from '../../middleware/validateRequest';
import { asyncHandler } from '../../middleware/asyncHandler';
import { readRateLimit } from '../../middleware/rateLimiter';
import { StatsSchema, MeterStatsSchema, TypeStatsSchema } from '../../schemas/poemSchemas';

const router = Router();
const statsController = new StatsController();

// إحصائيات شاملة (عامة)
router.get('/overview',
  readRateLimit,
  asyncHandler((req, res) => statsController.getOverview(req, res))
);

// إحصائيات مرنة (الطريقة المفضلة)
router.get('/',
  readRateLimit,
  validateRequest(StatsSchema),
  asyncHandler((req, res) => statsController.getFlexibleStats(req, res))
);

// إحصائيات بحر معين
router.get('/meter/:meter',
  readRateLimit,
  validateRequest(MeterStatsSchema),
  asyncHandler((req, res) => statsController.getMeterStats(req, res))
);

// إحصائيات نوع معين
router.get('/type/:type',
  readRateLimit,
  validateRequest(TypeStatsSchema),
  asyncHandler((req, res) => statsController.getTypeStats(req, res))
);

export default router;
