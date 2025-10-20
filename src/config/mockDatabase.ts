// Mock database for testing without MongoDB
import { Db } from 'mongodb';

class MockDatabase {
  private db: Db | null = null;
  private mockData: any[] = [];

  async connect(): Promise<void> {
    console.log('✅ تم الاتصال بقاعدة البيانات الوهمية (Mock) بنجاح');
    console.log('📊 قاعدة البيانات: hassan-app (Mock)');
    console.log('🔗 نوع الاتصال: وهمي (Mock)');
    
    // إضافة بيانات وهمية للمستخدمين
    this.mockData = [
      {
        _id: '68f436cd681b7411cb591bbd',
        name: 'Mahmoud Hassan',
        email: 'admin@example.com',
        password: '$2b$12$Znqli0x1NnqShnfz1JipQuSPrkUssBjw4VvRtkID6E2jSJR2VJv62',
        role: 'admin',
        createdAt: new Date('2025-10-19T00:54:37.719Z'),
        updatedAt: new Date('2025-10-19T00:54:37.719Z'),
        __v: 0
      }
    ];
  }

  async disconnect(): Promise<void> {
    console.log('🔌 تم قطع الاتصال بقاعدة البيانات الوهمية');
  }

  getDatabase(): Db {
    if (!this.db) {
      // إنشاء قاعدة بيانات وهمية
      this.db = {
        collection: (name: string) => ({
          insertOne: async (doc: any) => {
            const id = Math.random().toString(36).substr(2, 9);
            const newDoc = { _id: id, ...doc };
            this.mockData.push(newDoc);
            return { insertedId: id };
          },
          findOne: async (query: any) => {
            return this.mockData.find(doc => {
              if (query._id) {
                return doc._id === query._id;
              }
              if (query.email) {
                return doc.email === query.email;
              }
              return false;
            }) || null;
          },
          find: (query: any) => ({
            sort: (sort: any) => ({
              skip: (skip: number) => ({
                limit: (limit: number) => ({
                  toArray: async () => {
                    let results = [...this.mockData];
                    if (query.$or) {
                      results = results.filter(doc => 
                        query.$or.some((orQuery: any) => {
                          if (orQuery.title) {
                            return doc.title && doc.title.includes(orQuery.title.$regex);
                          }
                          if (orQuery.text) {
                            return doc.text && doc.text.includes(orQuery.text.$regex);
                          }
                          return false;
                        })
                      );
                    }
                    return results.slice(skip, skip + limit);
                  }
                })
              })
            })
          }),
          updateOne: async (query: any, update: any) => {
            const index = this.mockData.findIndex(doc => doc._id === query._id);
            if (index !== -1) {
              this.mockData[index] = { ...this.mockData[index], ...update.$set };
              return { matchedCount: 1, modifiedCount: 1 };
            }
            return { matchedCount: 0, modifiedCount: 0 };
          },
          deleteOne: async (query: any) => {
            const index = this.mockData.findIndex(doc => doc._id === query._id);
            if (index !== -1) {
              this.mockData.splice(index, 1);
              return { deletedCount: 1 };
            }
            return { deletedCount: 0 };
          },
          countDocuments: async (query: any) => {
            if (query.$or) {
              return this.mockData.filter(doc => 
                query.$or.some((orQuery: any) => {
                  if (orQuery.title) {
                    return doc.title && doc.title.includes(orQuery.title.$regex);
                  }
                  if (orQuery.text) {
                    return doc.text && doc.text.includes(orQuery.text.$regex);
                  }
                  return false;
                })
              ).length;
            }
            return this.mockData.length;
          }
        })
      } as any;
    }
    return this.db!;
  }

  getClient(): any {
    if (!this.db) {
      throw new Error('Database client not connected. Call connect() first.');
    }
    return this.db;
  }

  async isConnected(): Promise<boolean> {
    return true;
  }
}

// Create singleton instance
const database = new MockDatabase();

export default database;
