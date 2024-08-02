const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const articlesRouter = require("../api/articles/articles.router");

const mockUserId = new mongoose.Types.ObjectId();

// Mock du middleware d'authentification
jest.mock("../middlewares/auth", () => (req, res, next) => {
  req.user = { id: mockUserId.toString(), role: "admin" };
  next();
});

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.io = { emit: jest.fn() };
  next();
});
app.use('/api/articles', articlesRouter);

const mockArticle = {
  _id: new mongoose.Types.ObjectId(),
  title: 'Test Article',
  content: 'This is a test article.',
  status: 'draft',
  author: mockUserId
};

describe('Articles API', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should create an article', async () => {
    mockingoose(Article).toReturn(mockArticle, 'save');

    const res = await request(app)
      .post('/api/articles')
      .send({ title: mockArticle.title, content: mockArticle.content, status: mockArticle.status });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(mockArticle.title);
    expect(res.body.content).toBe(mockArticle.content);
  });

  it('should update an article', async () => {
    const updatedArticle = { ...mockArticle, title: 'Updated Title' };
    mockingoose(Article).toReturn(updatedArticle, 'findOneAndUpdate');

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
      .get(`/api/articles/user/${mockUserId}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]._id.toString()).toBe(mockArticle._id.toString());
  });
});