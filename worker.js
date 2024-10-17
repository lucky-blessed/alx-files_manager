import { fileQueue } from './utils/queues';
import imageThumbnail from 'image-thumbnail';
import dbClient from './utils/db';
import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';

fileQueue.process(async (job) => {
    const { userId, fileId } = job.data;

    if (!fileId) {
        throw new Error('Missing fileId');
    }
    if (!userId) {
        throw new Error('Missing userId');
    }

    const file = await dbClient.client
        .db(dbClient.dbName)
        .collection('files')
        .findOne({ _id: new ObjectId(fileId), userId });

    if (!file) {
        throw new Error('File not found');
    }

    const originalFilePath = path.join(__dirname, 'uploads', file.filename);
    const sizes = [500, 250, 100];

    try {
        await Promise.all(sizes.map(async (size) => {
            const thumbnail = await imageThumbnail(originalFilePath, { width: size });
            const thumbnailPath = `${originalFilePath}_${size}`;
            fs.writeFileSync(thumbnailPath, thumbnail);
        }));
    } catch (error) {
        console.error(`Error generating thumbnails for file ${fileId}:`, error);
        throw error;
    }
});