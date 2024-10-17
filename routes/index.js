import { Router } from 'express';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js'; // or the correct file name



const router = Router();

/**
 * Route for GET /status
 */
router.get('/status', AppController.getStatus);

/**
 * Route for GET /stats
 */
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew)

export default router;