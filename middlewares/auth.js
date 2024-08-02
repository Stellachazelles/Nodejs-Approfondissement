// /middlewares/auth.js
const User = require('../api/users/users.model');
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');
const config = require('../config');

module.exports = async (req, res, next) => {
  try {
    // Vérification de l'en-tête Authorization
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      throw new UnauthorizedError('Authorization header missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, config.secretJwtToken); // Vérification du token JWT

    const user = await User.findById(decoded.userId); // Récupération de l'utilisateur associé
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = user; // Ajout de l'utilisateur à l'objet de requête
    next();
  } catch (error) {
    next(new UnauthorizedError(error.message)); // Gestion des erreurs d'authentification
  }
};
