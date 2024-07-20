const express = require('express');
const router = express.Router();
const articlesController = require('./articles.controllers');
const authMiddleware = require('../../middlewares/auth');

router.post('/', authMiddleware, articlesController.create);
router.put('/:id', authMiddleware, articlesController.update);
router.delete('/:id', authMiddleware, articlesController.delete);
router.get('/user/:userId', articlesController.getArticlesByUser);

module.exports = router;