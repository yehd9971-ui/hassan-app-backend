import { Router } from 'express';
import poemsV1 from './v1/poems';

const api = Router();

// ترويسة تساعد العميل على معرفة النسخة الحالية
api.use((req, res, next) => {
  res.setHeader('X-API-Version', 'v1');
  next();
});

// مسارات النسخة الأولى
api.use('/v1/poems', poemsV1);

export default api;
