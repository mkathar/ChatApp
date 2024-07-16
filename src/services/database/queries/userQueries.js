module.exports = {
  findByEmail: "SELECT * FROM users WHERE email = $1",
  findByUsername: "SELECT * FROM users WHERE username = $1",
  create:
    "INSERT INTO users (username, email, password_hash, bio) VALUES($1, $2, $3, $4) RETURNING user_id",
  findById:
    "SELECT user_id, username, email, bio FROM users WHERE user_id = $1",
  updateLastSeen:
    "UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE user_id = $1",
  getUserSettings: "SELECT * FROM user_settings WHERE user_id = $1",
  updateUserSettings:
    "UPDATE user_settings SET theme = $2, notification_enabled = $3, language = $4, font_size = $5 WHERE user_id = $1",
};
