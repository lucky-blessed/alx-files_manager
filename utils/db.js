import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    this.client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    });
    this.dbName = 'files_manager';
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log(`Connected Successfully to MongoDB: 27017`);
    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
    }
  }

  isAlive() {
    return !!this.client && !!this.db;
  }

  async nbUsers() {
    if (!this.isAlive()) {
      throw new Error('DB connection is not alive');
    }

    try {
      const usersCollection = this.db.collection('users');
      const userCount = await usersCollection.countDocuments();
      return userCount;
    } catch (error) {
      console.error('Error fetching user count:', error);
      return 0;
    }
  }

  async nbFiles() {
    if (!this.isAlive()) {
      throw new Error('DB connection is not alive');
    }

    try {
      const filesCollection = this.db.collection('files');
      const fileCount = await filesCollection.countDocuments();
      return fileCount;
    } catch (error) {
      console.error('Error fetching file count:', error);
      return 0;
    }
  }
}

const dbClient = new DBClient();
export default dbClient;