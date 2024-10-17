import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db.js';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import redisClient from '../utils/redis.js';
import { ObjectId } from 'mongodb';
import { fileQueue } from '../utils/queues.js'; // Import the file queue

const writeFileAsync = promisify(fs.writeFile);

class FilesController {
  /**
   * POST /files - Upload a file
   */
  static async postUpload(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { file } = req;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const newFile = {
        userId,
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        isPublic: false,
      };

      // Insert the new file document into the database
      const result = await dbClient.client
        .db(dbClient.dbName)
        .collection('files')
        .insertOne(newFile);

      // If the file is an image, add a job to the queue for thumbnail generation
      if (file.mimetype.startsWith('image/')) {
        await fileQueue.add({ userId, fileId: result.insertedId });
      }

      return res.status(201).json({ id: result.insertedId, ...newFile });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * GET /files/:id/data - Get the file data based on size
   */
  static async getData(req, res) {
    const token = req.headers['x-token'];
    const fileId = req.params.id;
    const size = parseInt(req.query.size, 10); // Get size from query parameter

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const fileObjectId = new ObjectId(fileId);
      const file = await dbClient.client
        .db(dbClient.dbName)
        .collection('files')
        .findOne({ _id: fileObjectId, userId });

      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      // Construct the thumbnail file path
      const thumbnailPath = path.join(__dirname, '..', 'uploads', `${file.filename}_${size}`);
      
      // Check if the thumbnail file exists
      if (!fs.existsSync(thumbnailPath)) {
        return res.status(404).json({ error: 'Not found' });
      }

      return res.status(200).sendFile(thumbnailPath);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }
  }

  // Other methods can be added here if needed
}

export default FilesController;