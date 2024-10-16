import { Router } from 'express';
import AppController from '../controllers/AppController.js';

const router = Router();

/**
 * Route for GET /status
 */
router.get('/status', AppController.getStatus);

/**
 * Route for GET /stats
 */
router.get('/stats', AppController.getStats);

export default router;