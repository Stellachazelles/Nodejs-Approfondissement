const articlesService = require('./articles.service');

class ArticlesController {
  async create(req, res, next) {
    try {
      const article = await articlesService.create({ ...req.body, user: req.user._id });
      req.io.emit('article:created', article);
      res.status(201).json(article);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      const article = await articlesService.update(req.params.id, req.body);
      req.io.emit('article:updated', article);
      res.json(article);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      await articlesService.delete(req.params.id);
      req.io.emit('article:deleted', req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }

  // Ajoutez cette méthode
  async getArticlesByUser(req, res, next) {
    try {
      const articles = await articlesService.getArticlesByUser(req.params.userId);
      res.status(200).json(articles);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ArticlesController();
