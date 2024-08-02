const Article = require('./articles.schema');

class ArticlesService {
  async create(articleData) {
    console.log('ArticlesService: Creating article with data:', articleData);
    try {
      const article = new Article(articleData);
      const savedArticle = await article.save();
      console.log('ArticlesService: Article created successfully:', savedArticle);
      return savedArticle;
    } catch (error) {
      console.error('ArticlesService: Error creating article:', error);
      throw error;
    }
  }

  async update(id, articleData) {
    console.log('ArticlesService: Updating article:', id, 'with data:', articleData);
    try {
      const updatedArticle = await Article.findByIdAndUpdate(id, articleData, { new: true });
      console.log('ArticlesService: Article updated successfully:', updatedArticle);
      return updatedArticle;
    } catch (error) {
      console.error('ArticlesService: Error updating article:', error);
      throw error;
    }
  }

  async delete(id) {
    console.log('ArticlesService: Deleting article:', id);
    try {
      const deletedArticle = await Article.findByIdAndDelete(id);
      console.log('ArticlesService: Article deleted successfully:', deletedArticle);
      return deletedArticle;
    } catch (error) {
      console.error('ArticlesService: Error deleting article:', error);
      throw error;
    }
  }

  async getByUserId(userId) {
    console.log('ArticlesService: Getting articles for user:', userId);
    try {
      const articles = await Article.find({ author: userId }).populate('author', '-password');
      console.log('ArticlesService: Articles retrieved successfully:', articles);
      return articles;
    } catch (error) {
      console.error('ArticlesService: Error getting articles:', error);
      throw error;
    }
  }
}

module.exports = new ArticlesService();