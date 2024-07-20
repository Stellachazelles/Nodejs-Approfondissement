const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');
const authMiddleware = require('../../middlewares/auth');

router.get('/', usersController.getAll);
router.get('/:id', usersController.getById);
router.post('/', usersController.create);
router.put('/:id', authMiddleware, usersController.update);
router.delete('/:id', authMiddleware, usersController.delete);

module.exports = router;