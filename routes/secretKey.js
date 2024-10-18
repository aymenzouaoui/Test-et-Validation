import express from 'express';
import * as TokenController from '../controllers/secretKeyController.js';
import { authenticateUser, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route pour créer un nouveau token
router.post('/', TokenController.createToken,authenticateUser);

// Route pour obtenir tous les tokens
router.get('/', TokenController.getAllTokens,authenticateUser,authorizeAdmin);

// Route pour obtenir un token par son ID
router.get('/:id', TokenController.getTokenById);

// Route pour mettre à jour un token
router.put('/:id', TokenController.updateToken,authorizeAdmin);

// Route pour supprimer un token
router.delete('/:id', TokenController.deleteToken,authenticateUser);

// Route pour obtenir les tokens associés à un utilisateur par son ID
router.get('/user', TokenController.getTokensByUserId,authenticateUser);



export default router;
