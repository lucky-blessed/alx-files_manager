import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';

class AppController {
  /**
   * GET /status: Check Redis and MongoDB status
   */  
  static async getStatus(req, res) {
    try {
      const status = {
        redis: await redisClient.isAlive(), // Ensure this is an async function if it involves any async operations
        db: await dbClient.isAlive(), // Ensure this is an async function if it involves any async operations
      };
      return res.status(200).json(status);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to check service status' });
    }
  }

  /**
   * GET /stats: Return the number of users and files in MongoDB
   */
  static async getStats(req, res) {
    try {
      const usersCount = await dbClient.nbUsers();
      const filesCount = await dbClient.nbFiles();
      const stats = {
        users: usersCount,
        files: filesCount,
      };
      return res.status(200).json(stats);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to retrieve statistics' });
    }
  }
}

export default AppController;