module.exports = {
  create: `
    INSERT INTO messages (chat_id, sender_id, message_text, sent_at, is_edited)
    VALUES($1, $2, $3, CURRENT_TIMESTAMP, false)
    RETURNING *
  `,

  getMessageWithSender: `
    SELECT m.*, u.user_name as sender_name
    FROM messages m
    JOIN users u ON m.sender_id = u.user_id
    WHERE m.message_id = $1
  `,

  getMessagesForChat: `
    SELECT 
      m.*,
      u.user_name as sender_name,
      u.user_email as sender_email
    FROM messages m
    JOIN users u ON m.sender_id = u.user_id
    WHERE m.chat_id = $1
    ORDER BY m.sent_at ASC
  `,

  editMessage: `
    UPDATE messages
    SET 
      message_text = $1,
      is_edited = TRUE,
      edited_at = CURRENT_TIMESTAMP
    WHERE message_id = $2 AND sender_id = $3
    RETURNING *
  `,

  deleteMessage: `
    DELETE FROM messages
    WHERE message_id = $1
  `,

  getUnreadCount: `
    SELECT COUNT(*) 
    FROM messages 
    WHERE chat_id = $1 
    AND sender_id != $2 
    AND sent_at > (
      SELECT last_read_at 
      FROM chat_participants 
      WHERE chat_id = $1 
      AND user_id = $2
    )
  `,

  markAsRead: `
    UPDATE chat_participants 
    SET last_read_at = NOW() 
    WHERE chat_id = $1 AND user_id = $2
  `,

  getRecentMessages: `
    SELECT 
      m.*,
      u.user_name as sender_name,
      u.user_email as sender_email
    FROM messages m
    JOIN users u ON m.sender_id = u.user_id
    WHERE m.chat_id = $1
    ORDER BY m.sent_at DESC
    LIMIT $2 OFFSET $3
  `,
};
