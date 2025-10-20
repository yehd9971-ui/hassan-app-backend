import { MongoClient, Db, ServerApiVersion } from 'mongodb';

class Database {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect(): Promise<void> {
    try {
      const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/hassan-app';
      
      // Check if it's a local connection or Atlas connection
      const isLocalConnection = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
      
      let clientOptions: any = {};
      
      if (!isLocalConnection) {
        // For Atlas connections, use ServerApiVersion
        clientOptions = {
          serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
          }
        };
      }

      // Create a MongoClient with appropriate options
      this.client = new MongoClient(connectionString, clientOptions);

      await this.client.connect();
      
      if (!isLocalConnection) {
        // Send a ping to confirm a successful connection (for Atlas)
        await this.client.db("admin").command({ ping: 1 });
        console.log("✅ Pinged your deployment. You successfully connected to MongoDB Atlas!");
      } else {
        // For local connections, just ping the database
        await this.client.db("admin").command({ ping: 1 });
        console.log("✅ تم الاتصال بقاعدة البيانات MongoDB المحلية بنجاح!");
      }
      
      // Get database name from connection string or use default
      const dbName = this.extractDatabaseName(connectionString) || 'hassan-app';
      this.db = this.client.db(dbName);
      
      // Create collections if they don't exist
      await this.ensureCollectionsExist();
      
      console.log('✅ تم الاتصال بقاعدة البيانات MongoDB بنجاح');
      console.log(`📊 قاعدة البيانات: ${dbName}`);
      console.log(`🔗 نوع الاتصال: ${isLocalConnection ? 'محلي (Local)' : 'سحابي (Atlas)'}`);
    } catch (error) {
      console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error);
      console.log('💡 تأكد من تشغيل MongoDB محلياً على المنفذ 27017');
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log('🔌 تم قطع الاتصال بقاعدة البيانات');
    }
  }

  getDatabase(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  getClient(): MongoClient {
    if (!this.client) {
      throw new Error('Database client not connected. Call connect() first.');
    }
    return this.client;
  }

  private extractDatabaseName(connectionString: string): string | null {
    try {
      const url = new URL(connectionString);
      const pathname = url.pathname;
      return pathname && pathname !== '/' ? pathname.substring(1) : null;
    } catch {
      return null;
    }
  }

  // Health check for database
  async isConnected(): Promise<boolean> {
    try {
      if (!this.db) return false;
      await this.db.admin().ping();
      return true;
    } catch {
      return false;
    }
  }

  // Ensure required collections exist
  private async ensureCollectionsExist(): Promise<void> {
    if (!this.db) return;

    try {
      // Create users collection
      await this.db.createCollection('users').catch(() => {
        // Collection might already exist, ignore error
      });

      // Create poems collection
      await this.db.createCollection('poems').catch(() => {
        // Collection might already exist, ignore error
      });

      console.log('📁 تم التأكد من وجود المجموعات المطلوبة');
    } catch (error) {
      console.warn('⚠️  تحذير: لم يتم إنشاء بعض المجموعات:', error);
    }
  }
}

// Create singleton instance
const database = new Database();

export default database;
