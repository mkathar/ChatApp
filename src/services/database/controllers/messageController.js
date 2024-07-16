const db = require("../db");
const messageQueries = require("../queries/messageQueries");

module.exports = {
  createMessage: (chatId, senderId, messageText) =>
    db.one(messageQueries.create, [chatId, senderId, messageText]),
  getMessagesForChat: (chatId) =>
    db.any(messageQueries.getMessagesForChat, [chatId]),
  editMessage: (messageId, senderId, newText) =>
    db.oneOrNone(messageQueries.editMessage, [newText, messageId, senderId]),
};
