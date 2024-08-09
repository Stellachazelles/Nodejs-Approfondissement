const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const config = require("./config");
const NotFoundError = require("./errors/not-found");
const userRouter = require("./api/users/users.router");
const articleRouter = require("./api/articles/articles.router");
const usersController = require("./api/users/users.controller");
const authMiddleware = require("./middlewares/auth");

require("./api/articles/articles.schema");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté");
  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté");
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/articles", authMiddleware, articleRouter);
app.post("/login", usersController.login);

app.use("/", express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;
  res.status(status).json({
    status,
    message,
  });
});

async function startServer() {
  try {
    await config.connectToDatabase();
    console.log('Connecté à MongoDB');
    server.listen(config.port, () => {
      console.log(`Serveur en cours d'exécution sur http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error('Erreur de connexion à la base de données', err);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await config.closeDatabase();
  process.exit(0);
});

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  server,
};