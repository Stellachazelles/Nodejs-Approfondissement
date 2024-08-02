const User = require('../api/users/users.model');
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');
const config = require('../config');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      throw new UnauthorizedError('Authorization header missing');
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, config.secretJwtToken);

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedError(error.message));
  }
};