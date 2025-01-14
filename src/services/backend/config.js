require("dotenv").config();

module.exports = {
  dbConfig: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 6000,
    database: process.env.DB_NAME || "chatapp",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "Sanane132",
  },
  port: process.env.PORT || 3000,
  saltRounds: 10,
  sessionSecret: process.env.SESSION_SECRET || "your_very_secret_key_here",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret_key_here",
};
