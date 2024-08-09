const mongoose = require('mongoose');

const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/myapp",
  secretJwtToken: process.env.JWT_SECRET || "test",
  connectToDatabase: async () => {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
    return mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },
  closeDatabase: async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
};

module.exports = config;
