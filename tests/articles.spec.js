// /tests/articles.spec.js
const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/article/articles.schema"); // Assurez-vous que le chemin est correct
const articlesRouter = require("../api/article/articles.router"); // Assurez-vous que le chemin est correct
const authMiddleware = require("../middlewares/auth"); // Middleware d'authentification

// Configuration de l'application de test
const app = express();
app.use(express.json());
app.use(authMiddleware); // Ajoute l'authentification à toutes les requêtes
app.use('/api/articles', articlesRouter); // Utilisation correcte du routeur

// Mock data
const mockArticle = {
  _id: mongoose.Types.ObjectId().toString(), // Assurez-vous que c'est une chaîne
  title: 'Test Article',
  content: 'This is a test article.',
  status: 'draft',
  user: mongoose.Types.ObjectId().toString() // Assurez-vous que c'est une chaîne
};

describe('Articles API', () => {
  beforeEach(() => {
    mockingoose.resetAll(); // Réinitialise les mocks avant chaque test
  });

  it('should create an article', async () => {
    mockingoose(Article).toReturn(mockArticle, 'save'); // Mock le modèle Article pour simuler la sauvegarde

    const res = await request(app)
      .post('/api/articles')
      .set('Authorization', 'Bearer valid_token') // Simule un en-tête d'authentification valide
      .send(mockArticle);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(mockArticle.title);
    expect(res.body.content).toBe(mockArticle.content);
  });

  it('should update an article', async () => {
    mockingoose(Article).toReturn(mockArticle, 'findOneAndUpdate'); // Mock la mise à jour

    const res = await request(app)
      .put(`/api/articles/${mockArticle._id}`)
      .set('Authorization', 'Bearer valid_token')
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('should delete an article', async () => {
    mockingoose(Article).toReturn(mockArticle, 'findOneAndDelete'); // Mock la suppression

    const res = await request(app)
      .delete(`/api/articles/${mockArticle._id}`)
      .set('Authorization', 'Bearer valid_token');

    expect(res.status).toBe(204);
  });

  it('should get articles by user', async () => {
    mockingoose(Article).toReturn([mockArticle], 'find'); // Mock la recherche d'articles

    const res = await request(app)
      .get(`/api/articles/user/${mockArticle.user}/articles`)
      .set('Authorization', 'Bearer valid_token');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]._id).toBe(mockArticle._id);
  });
});
