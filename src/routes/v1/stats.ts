import { Router } from 'express';
import { StatsController } from '../../controllers/statsController';
import { validateRequest } from '../../middleware/validateRequest';
import { asyncHandler } from '../../middleware/asyncHandler';
import { statsRateLimit } from '../../middleware/rateLimiter';
import { StatsSchema, MeterStatsSchema, TypeStatsSchema } from '../../schemas/poemSchemas';

const router = Router();
const statsController = new StatsController();

// إحصائيات شاملة (عامة)
router.get('/overview',
  statsRateLimit,
  asyncHandler((req, res) => statsController.getOverview(req, res))
);

// إحصائيات مرنة (الطريقة المفضلة)
router.get('/',
  statsRateLimit,
  validateRequest(StatsSchema),
  asyncHandler((req, res) => statsController.getFlexibleStats(req, res))
);

// إحصائيات بحر معين
router.get('/meter/:meter',
  statsRateLimit,
  validateRequest(MeterStatsSchema),
  asyncHandler((req, res) => statsController.getMeterStats(req, res))
);

// إحصائيات نوع معين
router.get('/type/:type',
  statsRateLimit,
  validateRequest(TypeStatsSchema),
  asyncHandler((req, res) => statsController.getTypeStats(req, res))
);

export default router;
