// scripts/clean-poem-fields.js
// سكريبت لتنظيف حقول meter و poemType من المسافات والتشكيل

require('dotenv').config();
const { MongoClient } = require('mongodb');

const isProd = process.env.NODE_ENV === 'production';
const uri = process.env.MONGODB_URI?.trim() || 
  'mongodb+srv://drmohammedafifhassanapp:DrNjsuwnnaKKSdbbqjsndMSNndwuhNNDdshHJHWKdsAS%40!sds!sd-%40!f@cluster0.aspanut.mongodb.net/hassan-app?retryWrites=true&w=majority';

async function cleanPoemFields() {
  let client;
  try {
    console.log('🔄 بدء تنظيف حقول القصائد...');
    
    client = new MongoClient(uri);
    await client.connect();
    console.log('✅ تم الاتصال بـ MongoDB');

    const db = client.db('hassan-app');
    const poemsCollection = db.collection('poems');

    // عد القصائد قبل التنظيف
    const totalBefore = await poemsCollection.countDocuments();
    console.log(`📊 إجمالي القصائد: ${totalBefore}`);

    // تنظيف الحقول باستخدام aggregation pipeline
    const result = await poemsCollection.updateMany(
      {
        $or: [
          { meter: { $type: 'string' } },
          { poemType: { $type: 'string' } }
        ]
      },
      [
        {
          $set: {
            meter: {
              $cond: {
                if: { $eq: [{ $type: '$meter' }, 'string'] },
                then: { $trim: { input: '$meter' } },
                else: '$meter'
              }
            },
            poemType: {
              $cond: {
                if: { $eq: [{ $type: '$poemType' }, 'string'] },
                then: { $trim: { input: '$poemType' } },
                else: '$poemType'
              }
            }
          }
        }
      ]
    );

    console.log(`✅ تم تحديث ${result.modifiedCount} قصيدة`);
    console.log(`   - تم مطابقة: ${result.matchedCount}`);
    console.log(`   - تم التعديل: ${result.modifiedCount}`);

    // عرض عينة من القيم المنظفة
    const sample = await poemsCollection.find(
      { 
        $or: [
          { meter: { $exists: true, $ne: null } },
          { poemType: { $exists: true, $ne: null } }
        ]
      }
    ).limit(5).toArray();

    console.log('\n📋 عينة من القصائد المنظفة:');
    sample.forEach((poem, i) => {
      console.log(`${i + 1}. meter: "${poem.meter}" | poemType: "${poem.poemType}"`);
    });

    // إحصائيات meter
    console.log('\n📊 إحصائيات البحور:');
    const meterStats = await poemsCollection.aggregate([
      { $match: { meter: { $exists: true, $ne: null } } },
      { $group: { _id: '$meter', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();
    meterStats.forEach((stat, i) => {
      console.log(`${i + 1}. "${stat._id}": ${stat.count} قصيدة`);
    });

    // إحصائيات poemType
    console.log('\n📊 إحصائيات أنواع القصائد:');
    const typeStats = await poemsCollection.aggregate([
      { $match: { poemType: { $exists: true, $ne: null } } },
      { $group: { _id: '$poemType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    typeStats.forEach((stat, i) => {
      console.log(`${i + 1}. "${stat._id}": ${stat.count} قصيدة`);
    });

    console.log('\n✅ تم تنظيف الحقول بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في تنظيف الحقول:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 تم قطع الاتصال بـ MongoDB');
    }
  }
}

cleanPoemFields();

