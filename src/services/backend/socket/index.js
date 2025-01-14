const { Server } = require("socket.io");
let io; // Global io instance

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const connectedUsers = new Map();

  io.on("connection", (socket) => {
    console.log("Yeni socket bağlantısı:", socket.id);

    socket.on("setup", (userId) => {
      console.log("Setup isteği alındı. User ID:", userId);
      if (userId) {
        connectedUsers.set(userId, socket.id);
        socket.join(`user_${userId}`);
        console.log(`Kullanıcı ${userId} kendi odasına katıldı`);
      }
    });

    socket.on("join chat", (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log("Kullanıcı sohbete katıldı:", chatId);
    });

    socket.on("new message", async (messageData) => {
      console.log("Yeni mesaj alındı:", messageData);

      const chatRoom = `chat_${messageData.chat_id}`;

      try {
        io.to(chatRoom).emit("message received", messageData);
        console.log(`Mesaj ${chatRoom} odasına iletildi`);

        io.emit("chats updated");
        console.log("Sohbet listesi güncelleme sinyali gönderildi");
      } catch (error) {
        console.error("Mesaj gönderme hatası:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Kullanıcı ayrıldı:", socket.id);
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io henüz başlatılmadı!");
  }
  return io;
}

module.exports = {
  initializeSocket,
  getIO,
};
