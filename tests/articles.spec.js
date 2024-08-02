const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const articlesRouter = require("../api/articles/articles.router");
const authMiddleware = require("../middlewares/auth");

// Mock du middleware d'authentification
jest.mock("../middlewares/auth", () => (req, res, next) => {
  req.user = { _id: "mockUserId" };
  next();
});

const app = express();
app.use(express.json());
app.use(authMiddleware);
app.use('/api/articles', articlesRouter);

const mockArticle = {
  _id: mongoose.Types.ObjectId().toString(),
  title: 'Test Article',
  content: 'This is a test article.',
  status: 'draft',
  user: mongoose.Types.ObjectId().toString()
};

describe('Articles API', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should create an article', async () => {
    mockingoose(Article).toReturn(mockArticle, 'save');

    const res = await request(app)
      .post('/api/articles')
      .send(mockArticle);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(mockArticle.title);
    expect(res.body.content).toBe(mockArticle.content);
  });

  it('should update an article', async () => {
    mockingoose(Article).toReturn({ ...mockArticle, title: 'Updated Title' }, 'findOneAndUpdate');

    const res = await request(app)
      .put(`/api/articles/${mockArticle._id}`)
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('should delete an article', async () => {
    mockingoose(Article).toReturn(mockArticle, 'findOneAndDelete');

    const res = await request(app)
      .delete(`/api/articles/${mockArticle._id}`);

    expect(res.status).toBe(204);
  });

  it('should get articles by user', async () => {
    mockingoose(Article).toReturn([mockArticle], 'find');

    const res = await request(app)
      .get(`/api/articles/user/${mockArticle.user}/articles`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]._id).toBe(mockArticle._id);
  });
});