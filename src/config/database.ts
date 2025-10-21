import { MongoClient, Db, ServerApiVersion } from 'mongodb';

class Database {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect(): Promise<void> {
    const isProd = process.env.NODE_ENV === 'production';
    const uri = process.env.MONGODB_URI?.trim();

    if (!uri) {
      const msg = "MONGODB_URI not set";
      if (isProd) {
        console.error("❌", msg, "- running without database connection");
        return; // لا نتوقف، نستمر بدون قاعدة البيانات
      } else {
        console.warn("⚠️", msg, "- dev environment may use local DB if explicitly configured");
        return; // في التطوير فقط
      }
    }

    try {
      console.log("Connecting to MongoDB...");
      
      // Check if it's a local connection or Atlas connection
      const isLocalConnection = uri.includes('localhost') || uri.includes('127.0.0.1');
      
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
      this.client = new MongoClient(uri, clientOptions);

      await this.client.connect();
      
      if (!isLocalConnection) {
        // Send a ping to confirm a successful connection (for Atlas)
        await this.client.db("admin").command({ ping: 1 });
        console.log("✅ MongoDB connected successfully!");
      } else {
        // For local connections, just ping the database
        await this.client.db("admin").command({ ping: 1 });
        console.log("✅ MongoDB connected successfully!");
      }
      
      // Get database name from connection string or use default
      const dbName = this.extractDatabaseName(uri) || 'hassan-app';
      this.db = this.client.db(dbName);
      
      // Create collections if they don't exist
      await this.ensureCollectionsExist();
      
      console.log(`📊 Database: ${dbName}`);
      console.log(`🔗 Connection type: ${isLocalConnection ? 'Local' : 'Atlas'}`);
    } catch (error) {
      console.error("❌ MongoDB connection error:", (error as Error).message);
      // لا تُنهِ العملية هنا: اترك السيرفر يعمل و/health يظل ناجحاً
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