if (!process.env.NODE_ENV) {
    const dotenv = require("dotenv");
    dotenv.config();
  }
const config = {
    PORT: process.env.PORT || 4050,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET:"chitter",
};

module.exports = config;