import { Router } from 'express';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js'; 
import AuthController from '../controllers/AuthController.js'; 
import FilesController from '../controllers/FilesController.js'; // Import the FilesController

const router = Router();

// Define GET routes for application status and statistics
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// Define POST route for user creation
router.post('/users', UsersController.postNew);

// Define GET routes for authentication and user information
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);

// Define POST and GET routes for file handling
router.post('/files', FilesController.postUpload);
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);

// Define PUT routes to publish/unpublish files
router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);

export default router;