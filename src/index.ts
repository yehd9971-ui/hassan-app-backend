import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import database from './config/database';
import hassanAppRoutes from './routes/hassan-app';
import poemRoutes from './routes/poems';
import apiRoutes from './routes/index';
import healthRoutes from './routes/health';
import { helmetConfig, corsConfig } from './middleware/security';
import { sanitizeMongo, sanitizeSelective } from './middleware/sanitize';
import { initRateLimiterStore, closeRateLimiterStore } from './middleware/rateLimiter';
import { initCacheManager, closeCacheManager } from './utils/cacheManager';

// Load environment variables
dotenv.config();

console.log("🚀 Hassan App Backend - Ready for Production");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(helmetConfig); // Security headers
app.use(corsConfig); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies
app.use(sanitizeMongo); // MongoDB injection protection
app.use(sanitizeSelective); // Selective sanitization

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'مرحباً! خادم Node.js مع Express و TypeScript يعمل بنجاح',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Health check route - يجب أن يعمل حتى لو فشل الاتصال بقاعدة البيانات
app.get('/health', (_req, res) => res.status(200).send('OK'));

// Detailed health check route (للتحقق من قاعدة البيانات)
app.get('/health/detailed', async (req, res) => {
  try {
    const dbConnected = await database.isConnected();
    res.json({
      status: 'OK',
      uptime: process.uptime(),
      database: dbConnected ? 'Connected' : 'Disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      uptime: process.uptime(),
      database: 'Error',
      timestamp: new Date().toISOString()
    });
  }
});

// Hassan App routes
app.use('/hassan-app', hassanAppRoutes);

// API Versioned routes
app.use('/api', apiRoutes);

// Health Check routes
app.use('/health', healthRoutes);

// Legacy poems routes (deprecated) - redirect to v1
app.use('/poems', (req, res) => {
  res.setHeader('Deprecation', 'true'); // RFC 8594
  res.setHeader('Sunset', 'Tue, 30 Dec 2025 23:59:59 GMT');
  res.redirect(308, '/api/v1/poems' + req.url);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: 'الصفحة غير موجودة'
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('خطأ في الخادم:', err.stack);
  
  // خطأ في التحقق من البيانات
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'بيانات غير صحيحة',
      error: err.message
    });
    return;
  }
  
  // خطأ في قاعدة البيانات
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    res.status(500).json({
      success: false,
      code: 'DATABASE_ERROR',
      message: 'خطأ في قاعدة البيانات'
    });
    return;
  }
  
  // خطأ عام
  res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'خطأ في الخادم'
  });
});

// Start server
const startServer = async () => {
  // Start HTTP server first
  app.listen(PORT, '0.0.0.0', () => {
    console.log('Server running on', PORT);
    console.log(`🌍 URL: http://0.0.0.0:${PORT}`);
    console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
    console.log('✅ Server ready to accept requests');
    console.log("✅ Deployment ready and healthy");
  });

  // Connect to database after server starts
  await database.connect();
  
  // Initialize Redis for rate limiting (اختياري)
  try {
    await initRateLimiterStore();
  } catch (redisError) {
    console.warn('⚠️ تحذير: فشل الاتصال بـ Redis:', (redisError as Error).message);
  }
  
  // Initialize Cache Manager (اختياري)
  try {
    await initCacheManager();
  } catch (cacheError) {
    console.warn('⚠️ تحذير: فشل الاتصال بـ Redis للكاش:', (cacheError as Error).message);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 تم استلام إشارة الإيقاف...');
  await closeRateLimiterStore();
  await closeCacheManager();
  await database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 تم استلام إشارة الإيقاف...');
  await closeRateLimiterStore();
  await closeCacheManager();
  await database.disconnect();
  process.exit(0);
});

// Start the server
startServer();

export default app;
