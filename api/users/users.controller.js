const usersService = require('./users.service');
const UnauthorizedError = require('../../errors/unauthorized');
const NotFoundError = require('../../errors/not-found');
const jwt = require('jsonwebtoken');
const config = require('../../config');

class UsersController {
  async getAll(req, res, next) {
    try {
      const users = await usersService.getAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const user = await usersService.get(id);
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const user = await usersService.create(req.body);
      user.password = undefined;
      req.io.emit("user:create", user);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;
      const userModified = await usersService.update(id, data);
      if (!userModified) {
        throw new NotFoundError('User not found');
      }
      userModified.password = undefined;
      res.json(userModified);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const deletedUser = await usersService.delete(id);
      if (!deletedUser) {
        throw new NotFoundError('User not found');
      }
      req.io.emit("user:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await usersService.findByEmail(email);
      if (!user || !await usersService.checkPassword(user, password)) {
        throw new UnauthorizedError('Invalid credentials');
      }
      const token = jwt.sign({ userId: user._id }, config.secretJwtToken);
      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UsersController();