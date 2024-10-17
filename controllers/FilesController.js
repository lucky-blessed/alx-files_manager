import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import redisClient from '../utils/redis';

const writeFileAsync = promisify(fs.writeFile);

class FilesController {
  static async postUpload(req, res) {
    const token = req.headers['x-token'];
    const { name, type, parentId, isPublic = false, data } = req.body;

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }

    const acceptedTypes = ['folder', 'file', 'image'];
    if (!type || !acceptedTypes.includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }

    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    if (parentId) {
      const parentFile = await dbClient.client
        .db(dbClient.dbName)
        .collection('files')
        .findOne({ _id: parentId });

      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }

      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    const newFile = {
      userId,
      name,
      type,
      isPublic,
      parentId: parentId || 0,
    };

    if (type === 'folder') {
      const result = await dbClient.client
        .db(dbClient.dbName)
        .collection('files')
        .insertOne(newFile);

      return res.status(201).json({ id: result.insertedId, ...newFile });
    }

    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    await fs.promises.mkdir(folderPath, { recursive: true });

    const fileName = `${uuidv4()}`;
    const filePath = path.join(folderPath, fileName);

    const buffer = Buffer.from(data, 'base64');
    await writeFileAsync(filePath, buffer);

    newFile.localPath = filePath;

    const result = await dbClient.client
      .db(dbClient.dbName)
      .collection('files')
      .insertOne(newFile);

    return res.status(201).json({ id: result.insertedId, ...newFile });
  }
}

export default FilesController;