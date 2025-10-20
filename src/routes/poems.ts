import { Router } from 'express';
import { PoemController } from '../controllers/poemController';
import { validateObjectId } from '../middleware/validateObjectId';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validateRequest } from '../middleware/validateRequest';
import { asyncHandler } from '../middleware/asyncHandler';
import { readRateLimit, writeRateLimit } from '../middleware/rateLimiter';
import { CreatePoemSchema, UpdatePoemSchema, GetPoemsSchema, SearchPoemsSchema } from '../schemas/poemSchemas';

const router = Router();
const poemController = new PoemController();

// إنشاء قصيدة جديدة (محمية)
router.post('/',
  writeRateLimit,
  authenticate,
  authorize(['poet', 'admin']),
  validateRequest(CreatePoemSchema),
  asyncHandler((req, res) => poemController.createPoem(req, res))
);

// جلب جميع القصائد (عامة)
router.get('/',
  readRateLimit,
  validateRequest(GetPoemsSchema),
  asyncHandler((req, res) => poemController.getAllPoems(req, res))
);

// البحث في القصائد (عامة)
router.get('/search',
  readRateLimit,
  validateRequest(SearchPoemsSchema),
  asyncHandler((req, res) => poemController.searchPoems(req, res))
);

// جلب قصيدة بالمعرف (عامة)
router.get('/:id',
  readRateLimit,
  validateObjectId,
  asyncHandler((req, res) => poemController.getPoemById(req, res))
);

// تحديث قصيدة (محمية)
router.put('/:id',
  writeRateLimit,
  validateObjectId,
  authenticate,
  authorize(['poet', 'admin']),
  validateRequest(UpdatePoemSchema),
  asyncHandler((req, res) => poemController.updatePoem(req, res))
);

// حذف قصيدة (محمية)
router.delete('/:id',
  writeRateLimit,
  validateObjectId,
  authenticate,
  authorize(['poet', 'admin']),
  asyncHandler((req, res) => poemController.deletePoem(req, res))
);

export default router;
