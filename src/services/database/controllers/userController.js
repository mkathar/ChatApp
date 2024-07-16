const db = require("../db");
const bcrypt = require("bcrypt");
const { saltRounds } = require("../config");
const userQueries = require("../queries/userQueries");

module.exports = {
  findUserByEmail: (email) => db.oneOrNone(userQueries.findByEmail, [email]),
  findUserByUsername: (username) =>
    db.oneOrNone(userQueries.findByUsername, [username]),
  createUser: async (username, email, password, bio) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return db.one(userQueries.create, [username, email, hashedPassword, bio]);
  },
  findUserById: (userId) => db.oneOrNone(userQueries.findById, [userId]),
  updateLastSeen: (userId) => db.none(userQueries.updateLastSeen, [userId]),
  getUserSettings: (userId) =>
    db.oneOrNone(userQueries.getUserSettings, [userId]),
  updateUserSettings: (
    userId,
    theme,
    notificationEnabled,
    language,
    fontSize
  ) =>
    db.none(userQueries.updateUserSettings, [
      userId,
      theme,
      notificationEnabled,
      language,
      fontSize,
    ]),
  comparePasswords: (plainTextPassword, hashedPassword) =>
    bcrypt.compare(plainTextPassword, hashedPassword),
};
