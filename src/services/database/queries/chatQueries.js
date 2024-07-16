const db = require("../db");

module.exports = {
  createChat:
    "INSERT INTO chats (chat_type, chat_name) VALUES($1, $2) RETURNING *",
  addParticipant:
    "INSERT INTO chat_participants (chat_id, user_id) VALUES($1, $2)",
  getChatsForUser: (userId) =>
    db.any(
      `
    WITH latest_messages AS (
      SELECT DISTINCT ON (chat_id)
        chat_id,
        message_id,
        sender_id,
        message_text,
        sent_at
      FROM messages
      ORDER BY chat_id, sent_at DESC
    )
    SELECT 
      c.chat_id,
      c.chat_type,
      c.chat_name,
      CASE 
        WHEN c.chat_type = 'private' THEN
          (SELECT username FROM users WHERE user_id = 
            (SELECT user_id FROM chat_participants 
             WHERE chat_id = c.chat_id AND user_id != $1 LIMIT 1))
        ELSE c.chat_name
      END AS display_name,
      lm.message_id AS latest_message_id,
      lm.sender_id AS latest_message_sender_id,
      u.username AS latest_message_sender_name,
      lm.message_text AS latest_message_text,
      lm.sent_at AS latest_message_sent_at
    FROM chats c
    JOIN chat_participants cp ON c.chat_id = cp.chat_id
    LEFT JOIN latest_messages lm ON c.chat_id = lm.chat_id
    LEFT JOIN users u ON lm.sender_id = u.user_id
    WHERE cp.user_id = $1
    ORDER BY COALESCE(lm.sent_at, c.created_at) DESC
  `,
      [userId]
    ),
  getChatParticipants: `
    SELECT u.user_id, u.username, u.email
    FROM chat_participants cp
    JOIN users u ON cp.user_id = u.user_id
    WHERE cp.chat_id = $1
  `,
  getPrivateChat: `
    SELECT c.chat_id
    FROM chats c
    JOIN chat_participants cp1 ON c.chat_id = cp1.chat_id
    JOIN chat_participants cp2 ON c.chat_id = cp2.chat_id
    WHERE c.chat_type = 'private'
    AND cp1.user_id = $1 AND cp2.user_id = $2
  `,
  getLatestMessageForChat: `
    SELECT m.message_text, m.sent_at, u.username as sender_name
    FROM messages m
    JOIN users u ON m.sender_id = u.user_id
    WHERE m.chat_id = $1
    ORDER BY m.sent_at DESC
    LIMIT 1
  `,
};
