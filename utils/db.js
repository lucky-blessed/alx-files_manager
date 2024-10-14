import { MongoClient } from 'mongodb';

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'file_manager';

        const url = `mongodb://${host}:${port}`;
        this.client = new MongoClient(url, { useUnifiedTopology: true });
        this.dbName = database;
        this.connected = false;

        this.client.connect()
            .then(() => {
                this.connected = true;
                console.log('Connected Successfully to MongoDB');
            })
            .catch((error) => {
                this.connected = false;
                console.error('MongoDB connection error:', error.message);
            });
    }

    isAlive() {
        return this.connected;
    }

    async nbUsers() {
        if (!this.isAlive()) return 0;
        const db = this.client.db(this.dbName);
        const usersCollection = db.collection('users');
        return usersCollection.countDocuments();
    }

    async nbFiles() {
        if (!this.isAlive()) return 0;
        const db = this.client.db(this.dbName);
        const filesCollection = db.collection('files');
        return filesCollection.countDocuments();
    }
}

const dbClient = new DBClient();
export default dbClient;