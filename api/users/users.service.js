const Article = require('../articles/articles.schema');

class ArticlesService {
  create(articleData) {
    const article = new Article(articleData);
    return article.save();
  }

  update(id, articleData) {
    return Article.findByIdAndUpdate(id, articleData, { new: true, runValidators: true });
  }

  delete(id) {
    return Article.findByIdAndDelete(id);
  }

  getByUserId(userId) {
    return Article.find({ user: userId });
  }
}

module.exports = new ArticlesService();