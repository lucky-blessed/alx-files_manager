import { MongoClient } from 'mongodb';
import { promisify } from 'util';

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'file_manager';

        const url = `mongodb://${host}:${port}`;
        this.client = new MongoClient(url, { useUnifiedTopology: true});
        this.dbName = database;

        this.client.connect().catch((error) => {
            console.error('MongoDB connection error:', error);
        });
    }
    
    isAlive() {
        return this.client && this.client.topology && this.client.topology.isConnected();
    }

    async nbUser() {
        const db = this.client.db(this.dbName);
        const usersCollection = db.usersCollection('users');
        return usersCollection.countDocuments();
    }

    async nbFiles() {
        const db = this.client.db(this.dbName);
        const filesCollection = db.collection('files');
        return filesCollection.countDocuments();
    }
}

const dbClient = new DBClient();
export default dbClient;