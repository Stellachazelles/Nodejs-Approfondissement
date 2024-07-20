const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const NotFoundError = require("./errors/not-found");
const userRouter = require("./api/users/users.router");
const articleRouter = require("./api/articles/articles.router");
const usersController = require("./api/users/users.controller");
const authMiddleware = require("./middlewares/auth");

// Assurez-vous que ce chemin est correct
require("./api/articles/articles.schema");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Configuration
const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/myapp",
  secretJwtToken: process.env.JWT_SECRET || "votre_secret_jwt_ici",
};

// Socket.IO
io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté");
  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté");
  });
});

// Middleware pour ajouter io à req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRouter);
app.use("/api/articles", authMiddleware, articleRouter);
app.post("/login", usersController.login);

// Servir les fichiers statiques
app.use("/", express.static(path.join(__dirname, "public")));

// Gestion des erreurs 404
app.use((req, res, next) => {
  next(new NotFoundError());
});

// Gestion globale des erreurs
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;
  res.status(status).json({
    status,
    message,
  });
});

// Connexion à MongoDB
mongoose.set('strictQuery', true);
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connecté à MongoDB');
    // Démarrage du serveur
    server.listen(config.port, () => {
      console.log(`Serveur en cours d'exécution sur http://localhost:${config.port}`);
    });
  })
  .catch(err => {
    console.error('Erreur de connexion à la base de données', err);
  });

module.exports = {
  app,
  server,
};


app.use('/api/users', userRouter);
app.use('/api/articles', articleRouter);