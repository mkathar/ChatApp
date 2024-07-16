module.exports = {
  create:
    "INSERT INTO messages (chat_id, sender_id, message_text) VALUES($1, $2, $3) RETURNING *",
  getMessagesForChat: `
      SELECT m.*, u.username as sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.user_id
      WHERE m.chat_id = $1
      ORDER BY m.sent_at ASC
  `,
  editMessage:
    "UPDATE messages SET message_text = $1, is_edited = TRUE, edited_at = CURRENT_TIMESTAMP WHERE message_id = $2 AND sender_id = $3 RETURNING *",
};
