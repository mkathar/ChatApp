const express = require("express");
const http = require("http");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { port, sessionSecret } = require("./config");
const routes = require("./routes");
const { initializeSocket } = require("./socket");
const { errorHandler, AppError } = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/", routes);

const io = initializeSocket(server);

app.on("new_message", ({ message, chat_id }) => {
  io.to(`chat_${chat_id}`).emit("message received", message);
  io.emit("chats updated");
});

app.all("*", (req, res, next) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`); // Debug için log
  next(new AppError(`${req.originalUrl} - Bu URL sunucuda bulunamadı.`, 404));
});

app.use(errorHandler);

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
