import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import database from './config/database';
import hassanAppRoutes from './routes/hassan-app';
import poemRoutes from './routes/poems';
import apiRoutes from './routes/index';
import { helmetConfig, corsConfig } from './middleware/security';
import { sanitizeMongo, sanitizeSelective } from './middleware/sanitize';
import { initRateLimiterStore, closeRateLimiterStore } from './middleware/rateLimiter';

// Load environment variables
dotenv.config();

// Set default environment variables for testing
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET غير محدد - يجب تعيينه في متغيرات البيئة');
  process.env.JWT_SECRET = 'CHANGE_THIS_IN_PRODUCTION_' + Date.now();
}
// Check for required environment variables
const hasDbCredentials = process.env.DB_USER && process.env.DB_PASS && process.env.DB_HOST;
const hasMongoUri = process.env.MONGODB_URI;

if (!hasDbCredentials && !hasMongoUri) {
  console.error('❌ يجب تعيين متغيرات قاعدة البيانات - إما DB_USER, DB_PASS, DB_HOST أو MONGODB_URI');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

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
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    message: 'Server is running'
  });
});

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
  try {
    // Connect to database (لا نوقف السيرفر إذا فشل الاتصال)
    try {
      await database.connect();
    } catch (dbError) {
      console.warn('⚠️ تحذير: فشل الاتصال بقاعدة البيانات:', dbError);
      console.log('🔄 سيتم المحاولة مرة أخرى لاحقاً...');
    }
    
    // Initialize Redis for rate limiting (اختياري)
    try {
      await initRateLimiterStore();
    } catch (redisError) {
      console.warn('⚠️ تحذير: فشل الاتصال بـ Redis:', redisError);
    }
    
    // Start HTTP server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 URL: http://0.0.0.0:${PORT}`);
      console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
      console.log('✅ Server ready to accept requests');
      console.log("✅ Deployment ready and healthy");
    });
  } catch (error) {
    console.error('❌ فشل في بدء الخادم:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 تم استلام إشارة الإيقاف...');
  await closeRateLimiterStore();
  await database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 تم استلام إشارة الإيقاف...');
  await closeRateLimiterStore();
  await database.disconnect();
  process.exit(0);
});

// Start the server
startServer();

export default app;
