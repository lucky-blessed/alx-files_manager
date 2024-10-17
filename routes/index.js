import { Router } from 'express';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js';
import AuthController from '../controllers/AuthController.js'; // Import the AuthController

const router = Router();

/**
 * Route for GET /status
 */
router.get('/status', AppController.getStatus);

/**
 * Route for GET /stats
 */
router.get('/stats', AppController.getStats);

/**
 * Route for POST /users (Create a new user)
 */
router.post('/users', UsersController.postNew);

/**
 * Route for GET /connect (Authenticate user)
 */
router.get('/connect', AuthController.getConnect);

/**
 * Route for GET /disconnect (Sign out user)
 */
router.get('/disconnect', AuthController.getDisconnect);

/**
 * Route for GET /users/me (Retrieve user details)
 */
router.get('/users/me', UsersController.getMe);

export default router;