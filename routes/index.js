import { Router } from 'express';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js'; 
import AuthController from '../controllers/AuthController.js'; 
import FilesController from '../controllers/FilesController.js';

const router = Router();

// App status and stats routes
router.get('/status', AppController.getStatus); // Check server status
router