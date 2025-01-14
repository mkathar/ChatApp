const db = require("../db");

// Sohbet listesini getir
const getConversations = async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT c.*, 
        CASE 
          WHEN c.chat_type = 'private' THEN (
            SELECT u.user_name 
            FROM users u 
            JOIN chat_participants cp ON u.user_id = cp.user_id 
            WHERE cp.chat_id = c.chat_id AND u.user_id != $1
            LIMIT 1
          )
          ELSE c.chat_name 
        END as display_name,
        (
          SELECT m.message_text 
          FROM messages m 
          WHERE m.chat_id = c.chat_id 
          ORDER BY m.sent_at DESC 
          LIMIT 1
        ) as last_message
      FROM chats c
      JOIN chat_participants cp ON c.chat_id = cp.chat_id
      WHERE cp.user_id = $1
      ORDER BY c.created_at DESC
    `;

    const conversations = await db.any(query, [req.user.user_id]);
    res.json(conversations);
  } catch (error) {
    console.error("ERROR 💥", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Yeni sohbet oluştur
const createConversation = async (req, res) => {
  try {
    const { chat_type, chat_name, participants } = req.body;

    const chatQuery = `
      INSERT INTO chats (chat_type, chat_name, created_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const chat = await db.one(chatQuery, [chat_type, chat_name]);

    const participantQuery = `
      INSERT INTO chat_participants (chat_id, user_id, joined_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
    `;

    // Kendini ekle
    await db.none(participantQuery, [chat.chat_id, req.user.user_id]);

    // Diğer katılımcıları ekle
    for (const participant_id of participants) {
      await db.none(participantQuery, [chat.chat_id, participant_id]);
    }

    res.json(chat);
  } catch (error) {
    console.error("ERROR 💥", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getConversations,
  createConversation,
};
