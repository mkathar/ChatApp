const db = require("./db");
const bcrypt = require("bcrypt");
const { saltRounds } = require("./config");
const chatQueries = require("./queries/chatQueries");

module.exports = {
  findUserByEmail: (email) =>
    db.oneOrNone("SELECT * FROM users WHERE user_email = $1", [email]),

  findUserByUsername: (username) =>
    db.oneOrNone("SELECT * FROM users WHERE user_name = $1", [username]),

  createUser: async (username, email, password, bio) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return db.one(
      "INSERT INTO users (user_name, user_email, password_hash, bio) VALUES($1, $2, $3, $4) RETURNING user_id",
      [username, email, hashedPassword, bio]
    );
  },

  findUserById: (userId) =>
    db.oneOrNone(
      "SELECT user_id, user_name, user_email, bio FROM users WHERE user_id = $1",
      [userId]
    ),

  updateLastSeen: (userId) =>
    db.none(
      "UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE user_id = $1",
      [userId]
    ),

  getUserSettings: (userId) =>
    db.oneOrNone("SELECT * FROM user_settings WHERE user_id = $1", [userId]),

  updateUserSettings: (
    userId,
    theme,
    notificationEnabled,
    language,
    fontSize
  ) =>
    db.none(
      "UPDATE user_settings SET theme = $2, notification_enabled = $3, language = $4, font_size = $5 WHERE user_id = $1",
      [userId, theme, notificationEnabled, language, fontSize]
    ),

  createChat: (chatType, chatName) =>
    db.one(chatQueries.createChat, [chatType, chatName]),

  addChatParticipant: (chatId, userId) =>
    db.none(chatQueries.addParticipant, [chatId, userId]),

  getChatsForUser: async (userId) => {
    try {
      console.log("Starting getChatsForUser for userId:", userId);
      const chats = await db.any(
        `
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
        ),
        latest_messages AS (
          SELECT DISTINCT ON (chat_id)
            chat_id,
            message_id,
            sender_id,
            message_text,
            sent_at
          FROM messages
          ORDER BY chat_id, sent_at DESC
        ),
        user_last_seen AS (
          SELECT user_id, last_seen
          FROM users
          WHERE user_id IN (
            SELECT unnest(ci.participants)
            FROM chat_info ci
          )
        )
        SELECT 
          ci.*,
          lm.message_id AS latest_message_id,
          lm.sender_id AS latest_message_sender_id,
          u.user_name AS latest_message_sender_name,
          lm.message_text AS latest_message_text,
          lm.sent_at AS latest_message_sent_at,
          json_object_agg(uls.user_id, uls.last_seen) AS last_seen_times
        FROM chat_info ci
        LEFT JOIN latest_messages lm ON ci.chat_id = lm.chat_id
        LEFT JOIN users u ON lm.sender_id = u.user_id
        LEFT JOIN user_last_seen uls ON uls.user_id = ANY(ci.participants)
        GROUP BY ci.chat_id, ci.chat_type, ci.chat_name, ci.display_name, ci.participants,
                 lm.message_id, lm.sender_id, u.user_name, lm.message_text, lm.sent_at
        ORDER BY COALESCE(lm.sent_at, '1970-01-01'::timestamp) DESC, ci.chat_id DESC
      `,
        [userId]
      );
      console.log("Chats fetched successfully:", chats);
      return chats;
    } catch (error) {
      console.error("Error in getChatsForUser:", error);
      console.error("Error stack:", error.stack);
      throw new Error(`Failed to get chats for user: ${error.message}`);
    }
  },
  deleteChat: async (chatId) => {
    try {
      await db.tx(async (t) => {
        await t.none("DELETE FROM messages WHERE chat_id = $1", [chatId]);

        await t.none("DELETE FROM chat_participants WHERE chat_id = $1", [
          chatId,
        ]);

        await t.none("DELETE FROM chats WHERE chat_id = $1", [chatId]);
      });
      return true;
    } catch (error) {
      console.error("Error deleting chat:", error);
      throw error;
    }
  },

  createGroupChat: async (chatName, creatorId, participants) => {
    const chat = await db.one(chatQueries.createChat, ["group", chatName]);
    await db.none(chatQueries.addParticipant, [chat.chat_id, creatorId]);
    for (let participantId of participants) {
      await db.none(chatQueries.addParticipant, [chat.chat_id, participantId]);
    }
    return {
      ...chat,
      display_name: chatName,
      participants: [creatorId, ...participants],
    };
  },

  createPrivateChat: async (user1Id, user2Id) => {
    const existingChat = await db.oneOrNone(chatQueries.getPrivateChat, [
      user1Id,
      user2Id,
    ]);
    if (existingChat) return existingChat;

    const chat = await db.one(chatQueries.createChat, ["private", null]);
    await db.none(chatQueries.addParticipant, [chat.chat_id, user1Id]);
    await db.none(chatQueries.addParticipant, [chat.chat_id, user2Id]);
    const user2Name = await module.exports.getUsernameById(user2Id);
    return {
      ...chat,
      display_name: user2Name,
      participants: [user1Id, user2Id],
    };
  },

  getUsernameById: async (userId) => {
    const user = await db.one(
      "SELECT user_name FROM users WHERE user_id = $1",
      [userId]
    );
    return user.username;
  },

  // Message operations
  createMessage: (chatId, senderId, messageText) =>
    db.one(
      "INSERT INTO messages (chat_id, sender_id, message_text) VALUES($1, $2, $3) RETURNING *",
      [chatId, senderId, messageText]
    ),

  getMessagesForChat: (chatId) =>
    db.any(
      `
        SELECT m.*, u.user_name as sender_name
        FROM messages m
        JOIN users u ON m.sender_id = u.user_id
        WHERE m.chat_id = $1
        ORDER BY m.sent_at ASC
    `,
      [chatId]
    ),

  editMessage: (messageId, senderId, newText) =>
    db.oneOrNone(
      "UPDATE messages SET message_text = $1, is_edited = TRUE, edited_at = CURRENT_TIMESTAMP WHERE message_id = $2 AND sender_id = $3 RETURNING *",
      [newText, messageId, senderId]
    ),

  searchUsers: async (query) => {
    const searchPattern = `%${query}%`;
    try {
      const users = await db.any(
        `
        SELECT user_id, user_name, user_email
        FROM users
        WHERE user_name ILIKE $1 
           OR user_email ILIKE $1
           OR bio ILIKE $1
        LIMIT 10
      `,
        searchPattern
      );

      return users;
    } catch (error) {
      console.error("Kullanıcı arama SQL hatası:", error);
      console.error("Hata stack:", error.stack);
      throw new Error(`Kullanıcı arama hatası: ${error.message}`);
    }
  },

  comparePasswords: (plainTextPassword, hashedPassword) =>
    bcrypt.compare(plainTextPassword, hashedPassword),
};
