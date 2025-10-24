// scripts/sync-indexes.js
// سكريبت لإنشاء/مزامنة الفهارس المطلوبة في MongoDB

require('dotenv').config();
const { MongoClient } = require('mongodb');

const isProd = process.env.NODE_ENV === 'production';
const uri = process.env.MONGODB_URI?.trim() || 
  'mongodb+srv://drmohammedafifhassanapp:DrNjsuwnnaKKSdbbqjsndMSNndwuhNNDdshHJHWKdsAS%40!sds!sd-%40!f@cluster0.aspanut.mongodb.net/hassan-app?retryWrites=true&w=majority';

async function syncIndexes() {
  let client;
  try {
    console.log('🔄 بدء مزامنة الفهارس...');
    
    client = new MongoClient(uri);
    await client.connect();
    console.log('✅ تم الاتصال بـ MongoDB');

    const db = client.db('hassan-app');
    const poemsCollection = db.collection('poems');

    // إنشاء الفهرس المركب الجزئي
    // idx_meter_type_createdAt_pubTrue
    console.log('📊 إنشاء الفهرس المركب: idx_meter_type_createdAt_pubTrue');
    await poemsCollection.createIndex(
      { 
        meter: 1, 
        poemType: 1, 
        createdAt: -1 
      },
      {
        name: 'idx_meter_type_createdAt_pubTrue',
        partialFilterExpression: { 
          published: true 
        }
      }
    );
    console.log('✅ تم إنشاء الفهرس المركب بنجاح');

    // عرض جميع الفهارس
    const indexes = await poemsCollection.indexes();
    console.log('\n📋 قائمة الفهارس الحالية:');
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}:`, JSON.stringify(index.key));
      if (index.partialFilterExpression) {
        console.log('   🔍 فلتر جزئي:', JSON.stringify(index.partialFilterExpression));
      }
    });

    console.log('\n✅ تمت مزامنة الفهارس بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في مزامنة الفهارس:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 تم قطع الاتصال بـ MongoDB');
    }
  }
}

syncIndexes();

