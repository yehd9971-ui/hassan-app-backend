const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

async function listUsers() {
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

    // Get all users
    const users = await usersCollection.find({}).toArray();
    
    console.log(`\n📊 إجمالي المستخدمين: ${users.length}`);
    console.log('=' .repeat(50));
    
    users.forEach((user, index) => {
      console.log(`\n👤 المستخدم ${index + 1}:`);
      console.log(`   🆔 المعرف: ${user._id}`);
      console.log(`   📧 الإيميل: ${user.email}`);
      console.log(`   👤 الاسم: ${user.name}`);
      console.log(`   🔑 الصلاحية: ${user.role}`);
      console.log(`   📅 تاريخ الإنشاء: ${user.createdAt ? new Date(user.createdAt).toLocaleString('ar-SA') : 'غير محدد'}`);
      console.log(`   🔄 آخر تحديث: ${user.updatedAt ? new Date(user.updatedAt).toLocaleString('ar-SA') : 'غير محدد'}`);
      console.log(`   ✅ نشط: ${user.isActive ? 'نعم' : 'لا'}`);
    });

  } catch (error) {
    console.error('❌ خطأ في جلب المستخدمين:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 تم قطع الاتصال بقاعدة البيانات');
    }
  }
}

// Run the script
listUsers();
