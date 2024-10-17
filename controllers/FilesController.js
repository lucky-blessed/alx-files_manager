import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import redisClient from '../utils/redis';
import { ObjectId } from 'mongodb';

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

      const result = await dbClient.client
        .db(dbClient.dbName)
        .collection('files')
        .insertOne(newFile);

      return res.status(201).json({ id: result.insertedId, ...newFile });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * GET /files/:id - Get a file
   */
  static async getShow(req, res) {
    const token = req.headers['x-token'];
    const fileId = req.params.id;

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

      return res.status(200).json(file);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }
  }

  /**
   * GET /files - Get all files
   */
  static async getIndex(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const files = await dbClient.client
      .db(dbClient.dbName)
      .collection('files')
      .find({ userId })
      .toArray();

    return res.status(200).json(files);
  }

  /**
   * PUT /files/:id/publish - Set isPublic to true
   */
  static async putPublish(req, res) {
    const token = req.headers['x-token'];
    const fileId = req.params.id;

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

      await dbClient.client
        .db(dbClient.dbName)
        .collection('files')
        .updateOne({ _id: fileObjectId, userId }, { $set: { isPublic: true } });

      file.isPublic = true;
      return res.status(200).json(file);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }
  }

  /**
   * PUT /files/:id/unpublish - Set isPublic to false
   */
  static async putUnpublish(req, res) {
    const token = req.headers['x-token'];
    const fileId = req.params.id;

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

      await dbClient.client
        .db(dbClient.dbName)
        .collection('files')
        .updateOne({ _id: fileObjectId, userId }, { $set: { isPublic: false } });

      file.isPublic = false;
      return res.status(200).json(file);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }
  }
}

export default FilesController;