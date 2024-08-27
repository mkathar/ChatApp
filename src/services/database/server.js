const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { port, sessionSecret, JWT_SECRET } = require("./config");
const dbOperations = require("./dbOperations");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

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

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

app.post("/register", async (req, res) => {
  const { username, password, email, bio } = req.body;
  try {
    const existingUser = await dbOperations.findUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This email address is already in use." });
    }

    const existingUsername = await dbOperations.findUserByUsername(username);
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "This username is already taken." });
    }

    const newUser = await dbOperations.createUser(
      username,
      email,
      password,
      bio
    );
    res.status(201).json({
      message: "User successfully registered.",
      userId: newUser.user_id,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "An error occurred while registering the user." });
  }
});

app.post("/login", async (req, res) => {
  const { user_mail, user_password } = req.body;
  console.log(`Login attempt for email: ${user_mail}`);

  try {
    const user = await dbOperations.findUserByEmail(user_mail);

    if (!user) {
      console.log(`No user found for email: ${user_mail}`);
      return res
        .status(401)
        .json({ message: "No user found with this email address." });
    }

    console.log(`User found, comparing passwords for user: ${user.username}`);
    const passwordMatch = await dbOperations.comparePasswords(
      user_password,
      user.password_hash
    );

    if (passwordMatch) {
      console.log(`Password match successful for user: ${user.username}`);
      const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      });
      res.status(200).json({
        message: "Login successful",
        user: { id: user.user_id, name: user.username, email: user.email },
      });
    } else {
      console.log(`Password match failed for user: ${user.username}`);
      res.status(401).json({ message: "Incorrect password." });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
});

app.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await dbOperations.findUserById(req.userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in profile route:", error);
    res.status(500).send("Server error");
  }
});

app.get("/logout", verifyToken, async (req, res) => {
  try {
    await dbOperations.updateLastSeen(req.userId);

    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
      }
      res.clearCookie("token");
      res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "An error occurred during logout" });
  }
});

app.get("/user-chats", verifyToken, async (req, res) => {
  try {
    const chats = await dbOperations.getChatsForUser(req.userId);

    await dbOperations.updateLastSeen(req.userId);

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching user chats:", error);
    res.status(500).json({ error: "Error fetching user chats" });
  }
});

app.post("/messages", verifyToken, async (req, res) => {
  const { chat_id, message_text } = req.body;
  try {
    const newMessage = await dbOperations.createMessage(
      chat_id,
      req.userId,
      message_text
    );
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Error creating message" });
  }
});
app.delete("/chats/:chatId", verifyToken, async (req, res) => {
  const chatId = req.params.chatId;
  try {
    await dbOperations.deleteChat(chatId);
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the chat" });
  }
});

app.post("/new-chat", verifyToken, async (req, res) => {
  const { participants, chatName, isGroup } = req.body;
  const creatorId = req.userId;

  try {
    let newChat;
    if (isGroup) {
      newChat = await dbOperations.createGroupChat(
        chatName,
        creatorId,
        participants
      );
    } else {
      newChat = await dbOperations.createPrivateChat(
        creatorId,
        participants[0]
      );
    }

    if (!newChat.chat_id || !newChat.chat_type) {
      throw new Error("Invalid chat object created");
    }

    newChat.display_name = isGroup
      ? chatName
      : await dbOperations.getUsernameById(participants[0]);

    console.log("New chat created:", newChat);

    participants.forEach((userId) => {
      io.to(userId.toString()).emit("new chat", newChat);
    });

    res.status(201).json(newChat);
  } catch (error) {
    console.error("Error creating new chat:", error);
    res
      .status(500)
      .json({ error: "Failed to create new chat", details: error.message });
  }
});
app.get("/messages/:chatId", verifyToken, async (req, res) => {
  const chatId = req.params.chatId;
  try {
    const messages = await dbOperations.getMessagesForChat(chatId);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching messages" });
  }
});
app.get("/users/search", verifyToken, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Arama sorgusu gerekli" });
  }

  try {
    const users = await dbOperations.searchUsers(query);
    res.json(users);
  } catch (error) {
    console.error("Kullanıcı arama hatası:", error);
    console.error("Hata stack:", error.stack);
    res.status(500).json({
      error: "Kullanıcı araması sırasında bir hata oluştu",
      details: error.message,
    });
  }
});
app.post("/new-chat", verifyToken, async (req, res) => {
  const { participants, chatName, isGroup } = req.body;
  const creatorId = req.userId;

  try {
    let newChat;
    if (isGroup) {
      newChat = await dbOperations.createGroupChat(
        chatName,
        creatorId,
        participants
      );
    } else {
      newChat = await dbOperations.createPrivateChat(
        creatorId,
        participants[0]
      );
    }

    if (!newChat.chat_id || !newChat.chat_type) {
      throw new Error("Invalid chat object created");
    }

    newChat.display_name = isGroup
      ? chatName
      : await dbOperations.getUsernameById(participants[0]);

    console.log("New chat created:", newChat);
    res.status(201).json(newChat);
  } catch (error) {
    console.error("Error creating new chat:", error);
    res
      .status(500)
      .json({ error: "Failed to create new chat", details: error.message });
  }
});

// WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join chat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("leave chat", (chatId) => {
    socket.leave(chatId);
  });

  socket.on("new message", async (messageData) => {
    try {
      socket.to(messageData.chat_id).emit("message received", messageData);

      const updatedChats = await dbOperations.getChatsForUser(
        messageData.sender_id
      );
      io.to(messageData.sender_id).emit("chats updated", updatedChats);
    } catch (error) {
      console.error("Error handling new message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
