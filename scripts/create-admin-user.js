const bcrypt = require('bcryptjs');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

async function createAdminUser() {
  let client;
  
  try {
    // Connect to MongoDB Atlas
    const connectionString = process.env.MONGODB_URI || 'mongodb+srv://drmohammedafifhassanapp:DrNjsuwnnaKKSdbbqjsndMSNndwuhNNDdshHJHWKdsAS%40%21sds%21sd-%40%21f@cluster0.aspanut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    const clientOptions = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    };

    client = new MongoClient(connectionString, clientOptions);
    await client.connect();
    
    console.log('✅ تم الاتصال بقاعدة البيانات MongoDB Atlas');

    const db = client.db('hassan-app');
    const usersCollection = db.collection('users');

    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({ 
      $or: [
        { email: 'info@brightc0de.com' },
        { role: 'admin' }
      ]
    });

    if (existingAdmin) {
      console.log('⚠️  المستخدم الإداري موجود بالفعل:', existingAdmin.email);
      return;
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('StrongP@ssw0rd!', saltRounds);

    // Create admin user
    const adminUser = {
      name: 'Mahmoud Hassan',
      email: 'info@brightc0de.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      lastLogin: null
    };

    // Insert the admin user
    const result = await usersCollection.insertOne(adminUser);
    
    console.log('✅ تم إنشاء المستخدم الإداري بنجاح!');
    console.log('📧 الإيميل:', adminUser.email);
    console.log('👤 الاسم:', adminUser.name);
    console.log('🔑 الصلاحية:', adminUser.role);
    console.log('🆔 معرف المستخدم:', result.insertedId);
    console.log('📅 تاريخ الإنشاء:', adminUser.createdAt.toISOString());

  } catch (error) {
    console.error('❌ خطأ في إنشاء المستخدم الإداري:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 تم قطع الاتصال بقاعدة البيانات');
    }
  }
}

// Run the script
createAdminUser();
