import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
    constructor() {
        this.client = createClient();

        this.client.on_connect('error', (err) => console.error('Redis client not connected to the server:', err));

        // Promisify get, set, and del command for async/await use
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
        this.delAsync = promisify(this.client.del).bind(this.client);
    }

    // Check if Redis is connected
    isAlive() {
        return this.client.connected;
    }

    // Get a value from Redis
    async get(key) {
        const value = await this.getAsync(key);
        return value;
    }

    //Set a key-value pair in Redis with an expiration time
    async set(key, value, duration) {
        await this.setAsync(key, value, 'EX', duration);
    }

    // Delete a key from Redis
    async del(key) {
        await this.delAsync(key);
    }
}

// Export a single instance of the RedisClient
const redisClient = new RedisClient();
export default redisClient;