const articlesService = require('./articles.service');
const NotFoundError = require('../../errors/not-found');

class ArticlesController {
  async create(req, res, next) {
    try {
      console.log('Creating article with data:', req.body);
      const article = await articlesService.create({ ...req.body, author: req.user.id });
      console.log('Article created:', article);
      if (req.io && typeof req.io.emit === 'function') {
        req.io.emit('article:created', article);
      }
      res.status(201).json(article);
    } catch (error) {
      console.error('Error creating article:', error);
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      console.log('Updating article:', req.params.id, 'with data:', req.body);
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      const article = await articlesService.update(req.params.id, req.body);
      if (!article) {
        throw new NotFoundError('Article not found');
      }
      console.log('Article updated:', article);
      if (req.io && typeof req.io.emit === 'function') {
        req.io.emit('article:updated', article);
      }
      res.json(article);
    } catch (error) {
      console.error('Error updating article:', error);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      console.log('Deleting article:', req.params.id);
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      const deletedArticle = await articlesService.delete(req.params.id);
      if (!deletedArticle) {
        throw new NotFoundError('Article not found');
      }
      console.log('Article deleted:', deletedArticle);
      if (req.io && typeof req.io.emit === 'function') {
        req.io.emit('article:deleted', req.params.id);
      }
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting article:', error);
      next(error);
    }
  }

  async getArticlesByUser(req, res, next) {
    try {
      console.log('Getting articles for user:', req.params.userId);
      const articles = await articlesService.getByUserId(req.params.userId);
      console.log('Articles retrieved:', articles);
      res.status(200).json(articles);
    } catch (error) {
      console.error('Error getting articles:', error);
      next(error);
    }
  }
}

module.exports = new ArticlesController();