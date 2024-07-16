const db = require("../db");
const chatQueries = require("../queries/chatQueries");

module.exports = {
  createChat: (chatType, chatName) =>
    db.one(chatQueries.createChat, [chatType, chatName]),
  addParticipant: (chatId, userId) =>
    db.none(chatQueries.addParticipant, [chatId, userId]),
  getChatsForUser: async (userId) => {
    const chats = await db.any(chatQueries.getChatsForUser, [userId]);
    for (let chat of chats) {
      const latestMessage = await db.oneOrNone(
        chatQueries.getLatestMessageForChat,
        [chat.chat_id]
      );
      chat.latestMessage = latestMessage;
    }
    return chats;
  },
  getChatParticipants: (chatId) =>
    db.any(chatQueries.getChatParticipants, [chatId]),
  getOrCreatePrivateChat: async (user1Id, user2Id) => {
    const existingChat = await db.oneOrNone(chatQueries.getPrivateChat, [
      user1Id,
      user2Id,
    ]);
    if (existingChat) {
      return existingChat;
    }
    const newChat = await db.one(chatQueries.createChat, ["private", null]);
    await db.none(chatQueries.addParticipant, [newChat.chat_id, user1Id]);
    await db.none(chatQueries.addParticipant, [newChat.chat_id, user2Id]);
    return newChat;
  },
};
