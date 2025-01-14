const db = require("../db");
const dbOperations = require("../dbOperations");

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await dbOperations.getMessagesForChat(chatId);
    res.json(messages);
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { message_text, chat_id, sender_id } = req.body;

    console.log("Gelen mesaj verileri:", req.body);

    if (!message_text || !chat_id || !sender_id) {
      return res.status(400).json({
        error: "Eksik bilgi",
        required: ["message_text", "chat_id", "sender_id"],
        received: req.body,
      });
    }

    const newMessage = await dbOperations.createMessage(
      chat_id,
      sender_id,
      message_text
    );

    req.app.emit("new_message", {
      message: newMessage,
      chat_id: chat_id,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Mesaj gönderme hatası:", error);
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};
