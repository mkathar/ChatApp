const db = require("../db");

module.exports = {
  createChat: `
    INSERT INTO chats (chat_type, chat_name) 
    VALUES($1, $2) 
    RETURNING *
  `,

  addParticipant: `
    INSERT INTO chat_participants (chat_id, user_id, joined_at) 
    VALUES($1, $2, CURRENT_TIMESTAMP)
  `,

  getChatsForUser: `
    WITH chat_info AS (
      SELECT 
        c.chat_id,
        c.chat_type,
        c.chat_name,
        CASE 
          WHEN c.chat_type = 'private' THEN
            (SELECT user_name FROM users WHERE user_id = 
              (SELECT user_id FROM chat_participants 
               WHERE chat_id = c.chat_id AND user_id != $1 LIMIT 1))
          ELSE c.chat_name
        END AS display_name,
        (SELECT array_agg(user_id) FROM chat_participants WHERE chat_id = c.chat_id) AS participants
      FROM chats c
      JOIN chat_participants cp ON c.chat_id = cp.chat_id
      WHERE cp.user_id = $1
    )
    SELECT * FROM chat_info
    ORDER BY chat_id DESC
  `,

  getChatParticipants: `
    SELECT u.user_id, u.user_name, u.user_email, u.bio
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
    SELECT 
      m.message_id,
      m.sender_id,
      m.message_text,
      m.sent_at,
      u.user_name as sender_name
    FROM messages m
    JOIN users u ON m.sender_id = u.user_id
    WHERE m.chat_id = $1
    ORDER BY m.sent_at DESC
    LIMIT 1
  `,
};
