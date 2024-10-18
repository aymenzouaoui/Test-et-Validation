import Token from '../models/secretKey.js';

import { authenticateUser, authorizeAdmin } from '../middlewares/authMiddleware.js';
export async function createToken(req, res) {
  try {
   

    // Generate a unique secret key for the token (to be used as a secret key for the JWT)
    const secretKey = "ccccccccccc";

    // Create the JWT payload (containing the information you want to include in the token)
    const jwtPayload = {
      subscriptionType: "free", // Example subscription type
      // Add other data if necessary
    };

    // Generate the JSON Web Token (JWT) from the payload and the unique secret key
    const jwtToken = jwt.sign(jwtPayload, secretKey, { expiresIn: '1h' }); // Example: expires in 1 hour

    // Create the token in the database with the unique secret key and the JWT
    const token = await Token.create({ secretKey, jwtToken });
    await token.save();

    res.status(201).json(token);
  } catch (error) {
    console.error('Error creating token:', error);
    res.status(500).json({ error: 'An error occurred while creating the token' });
  }
}


export async function getAllTokens(req, res) {
  try {
    const tokens = await Token.find();
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des tokens' });
  }
}

export async function getTokenById(req, res) {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) {
      return res.status(404).json({ error: 'Token non trouvé' });
    }
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du token' });
  }
}

export async function updateToken(req, res) {
  try {
    const { user, application, value, expirationDate } = req.body;
    const token = await Token.findByIdAndUpdate(req.params.id, { user, application, value, expirationDate }, { new: true });
    if (!token) {
      return res.status(404).json({ error: 'Token non trouvé' });
    }
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du token' });
  }
}

export async function deleteToken(req, res) {
  try {
    const token = await Token.findByIdAndDelete(req.params.id);
    if (!token) {
      return res.status(404).json({ error: 'Token non trouvé' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du token' });
  }
}
export async function getTokensByUserId(req, res) {
  try {
    const { userId } = req.user;
    const tokens = await Token.find({ user: userId });
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des tokens de l\'utilisateur' });
  }
}