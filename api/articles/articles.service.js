const Article = require('./articles.schema');

class ArticlesService {
  create(articleData) {
    const article = new Article(articleData);
    return article.save();
  }

  update(id, articleData) {
    return Article.findByIdAndUpdate(id, articleData, { new: true });
  }

  delete(id) {
    return Article.findByIdAndDelete(id);
  }

  getByUserId(userId) {
    return Article.find({ user: userId }).populate('user', '-password');
  }
}

module.exports = new ArticlesService();