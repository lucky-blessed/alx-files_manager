import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
    /**
     * Method to handle GET /status.
     */
    static async getStatus(req, res) {
        const status = {
            redis: redisClient.isAlive(),
            db: dbClient.isAlive(),
        };
        return res.status(200).json(status);
    }

     
    static async getStats(req, res) {
        const userCount = await dbClient.nbUsers();
        const filesCount = await dbClient.nbFiles();
        res.status(200).json({ users: userCount, files: filesCount });
    }
}

export default AppController;