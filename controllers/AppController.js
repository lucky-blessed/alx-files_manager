import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';

class AppController {
/**
 * GET /status: Check Redis and MongoDB status
 */  
  static async getStatus(req, res) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    return res.status(200).json(status);
  }

  /**
   * GET /stats: Return the number of users and files in MongoDB
   */
  static async getStats(req, res) {
    const usersCount = await dbClient.nbUsers();
    const filesCount = await dbClient.nbFiles();
    const stats = {
      users: usersCount,
      files: filesCount,
    };
    return res.status(200).json(stats);
  }
}

export default AppController;