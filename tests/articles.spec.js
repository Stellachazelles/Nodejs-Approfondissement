const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const NotFoundErrorBis = require("../errors/not-found"); 
const userRouter = require("../api/users/users.router"); 
const articleRouter = require("../api/articles/articles.router"); 
const usersController = require("../api/users/users.controller"); 
const authMiddleware = require("../middlewares/auth"); 
const mockingoose = require('mockingoose'); // REVOIR
const articleTest = require("../api/articles/articles.schema"); 
const app = express();

// Mock data
const mockArticle = {
  _id: mongoose.Types.ObjectId(),
  title: 'Test Article',
  content: 'This is a test article.',
  status: 'draft',
  author: mongoose.Types.ObjectId()
};

describe('Articles API', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should create an article', async () => {
    mockingoose(Article).toReturn(mockArticle, 'save');

    const res = await request(app)
      .post('/api/articles')
      .set('Authorization', 'Bearer valid_token')
      .send(mockArticle);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(mockArticle.title);
  });

  it('should update an article', async () => {
    mockingoose(Article).toReturn(mockArticle, 'findOneAndUpdate');

    const res = await request(app)
      .put(`/api/articles/${mockArticle._id}`)
      .set('Authorization', 'Bearer valid_token')
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('should delete an article', async () => {
    mockingoose(Article).toReturn(mockArticle, 'findOneAndDelete');

    const res = await request(app)
      .delete(`/api/articles/${mockArticle._id}`)
      .set('Authorization', 'Bearer valid_token');

    expect(res.status).toBe(204);
  });

  it('should get articles by user', async () => {
    mockingoose(Article).toReturn([mockArticle], 'find');

    const res = await request(app)
      .get(`/api/articles/user/${mockArticle.author}/articles`)
      .set('Authorization', 'Bearer valid_token');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]._id).toBe(mockArticle._id.toString());
  });
});
