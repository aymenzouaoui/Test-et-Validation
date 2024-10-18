import express from 'express';
import * as ApplicationController from '../controllers/ApplicationController.js';
import { authenticateUser, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route pour créer une nouvelle application
router.post('/', ApplicationController.createApplication,authenticateUser);

// Route pour obtenir toutes les applications
router.get('/super', ApplicationController.getAllApplications,authorizeAdmin);

// Route pour obtenir une application par son ID
router.get('/:id', ApplicationController.getApplicationById,authenticateUser);

// Route pour mettre à jour une application
router.put('/:id', ApplicationController.updateApplication,authenticateUser);

// Route pour supprimer une application
router.delete('/:id', ApplicationController.deleteApplication,authenticateUser);

// Route pour obtenir les applications associées à un utilisateur par son ID
router.get('/', ApplicationController.getApplicationsByUserId,authenticateUser);

export default router;
