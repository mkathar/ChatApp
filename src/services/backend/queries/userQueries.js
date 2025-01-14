module.exports = {
  findByEmail: "SELECT * FROM users WHERE user_email = $1",
  findByUsername: "SELECT * FROM users WHERE user_name = $1",
  create: `
    INSERT INTO users (user_name, user_email, password_hash, bio)
    VALUES($1, $2, $3, $4)
    RETURNING user_id
  `,
  findById: `
    SELECT user_id, user_name, user_email, bio
    FROM users
    WHERE user_id = $1
  `,
  updateLastSeen: `
    UPDATE users
    SET last_seen = CURRENT_TIMESTAMP
    WHERE user_id = $1
  `,
  getUserSettings: `
    SELECT *
    FROM user_settings
    WHERE user_id = $1
  `,
  createUserSettings: `
    INSERT INTO user_settings (
      user_id, 
      theme, 
      notification_enabled, 
      language, 
      font_size, 
      last_updated
    ) VALUES ($1, 'light', true, 'tr', 'medium', CURRENT_TIMESTAMP)
  `,
  updateUserSettings: `
    UPDATE user_settings 
    SET 
      theme = $2,
      notification_enabled = $3,
      language = $4,
      font_size = $5,
      last_updated = CURRENT_TIMESTAMP
    WHERE user_id = $1
  `,
  searchUsers: `
    SELECT user_id, user_name, user_email
    FROM users
    WHERE user_name ILIKE $1
       OR user_email ILIKE $1
       OR bio ILIKE $1
    LIMIT 10
  `,
};
