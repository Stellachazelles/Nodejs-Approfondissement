const User = require('../api/users/users.model');
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');
const config = require('../config');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, config.secretJwtToken);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new UnauthorizedError();
    }

    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedError(error.message));
  }
};
