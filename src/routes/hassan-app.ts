import { Router } from 'express';
import database from '../config/mockDatabase';
import { authRateLimit } from '../middleware/rateLimiter';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

// Welcome route for Hassan App
router.get('/', (req, res) => {
  res.json({
    message: 'مرحباً بك في Hassan App!',
    app: 'Hassan App',
    version: '1.0.0',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// App info route
router.get('/info', async (req, res) => {
  try {
    const dbConnected = await database.isConnected();
    
    res.json({
      app: 'Hassan App',
      version: '1.0.0',
      description: 'تطبيق Hassan - مشروع باك إند متقدم',
      features: [
        'Node.js + Express + TypeScript',
        'MongoDB Atlas Integration',
        'RESTful API',
        'Error Handling',
        'Security Headers',
        'CORS Support'
      ],
      database: {
        connected: dbConnected,
        name: 'learnnode'
      },
      endpoints: {
        base: '/hassan-app',
        info: '/hassan-app/info',
        health: '/hassan-app/health',
        users: '/hassan-app/users',
        posts: '/hassan-app/posts'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'خطأ في جلب معلومات التطبيق',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check for Hassan App
router.get('/health', async (req, res) => {
  try {
    const dbConnected = await database.isConnected();
    
    res.json({
      app: 'Hassan App',
      status: 'healthy',
      database: dbConnected ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      app: 'Hassan App',
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// مسار تسجيل الدخول
router.post('/login',
  authRateLimit,
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    
    // التحقق من البيانات المطلوبة
    if (!username || !password) {
      res.status(400).json({
        success: false,
        code: 'MISSING_CREDENTIALS',
        message: 'اسم المستخدم وكلمة المرور مطلوبان'
      });
      return;
    }

    try {
      // البحث عن المستخدم في قاعدة البيانات
      const database = require('../config/database').default;
      const db = database.getDatabase();
      const usersCollection = db.collection('users');
      
      const user = await usersCollection.findOne({ email: username });
      
      if (!user) {
        res.status(401).json({
          success: false,
          code: 'INVALID_CREDENTIALS',
          message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
        });
        return;
      }

      // التحقق من كلمة المرور (في الإنتاج، استخدم bcryptjs.compare)
      const bcrypt = require('bcryptjs');
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          code: 'INVALID_CREDENTIALS',
          message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
        });
        return;
      }

      // إنشاء JWT token
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { 
          id: user._id.toString(), 
          role: user.role,
          username: user.email 
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );
      
      res.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        data: {
          token,
          user: { 
            id: user._id.toString(), 
            role: user.role, 
            username: user.email,
            name: user.name
          }
        }
      });

    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      res.status(500).json({
        success: false,
        code: 'LOGIN_ERROR',
        message: 'خطأ في تسجيل الدخول'
      });
    }
  })
);

// مسار تسجيل الخروج
router.post('/logout',
  authRateLimit,
  asyncHandler(async (req, res) => {
    // في الإنتاج، يمكن إضافة token إلى blacklist
    res.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    });
  })
);

// مسار التحقق من صحة التوكن
router.get('/verify-token',
  authRateLimit,
  asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        code: 'TOKEN_REQUIRED',
        message: 'رمز المصادقة مطلوب'
      });
      return;
    }

    try {
      const token = authHeader.substring(7);
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      
      res.json({
        success: true,
        message: 'التوكن صالح',
        data: {
          user: decoded
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        code: 'TOKEN_INVALID',
        message: 'رمز المصادقة غير صالح'
      });
    }
  })
);

// Placeholder routes for future features
router.get('/users', (req, res) => {
  res.json({
    message: 'قائمة المستخدمين - قريباً',
    app: 'Hassan App',
    status: 'coming_soon',
    timestamp: new Date().toISOString()
  });
});

router.get('/posts', (req, res) => {
  res.json({
    message: 'قائمة المنشورات - قريباً',
    app: 'Hassan App',
    status: 'coming_soon',
    timestamp: new Date().toISOString()
  });
});

export default router;
