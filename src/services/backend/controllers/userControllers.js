const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { user_name, user_email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (user_name, user_email, password_hash, created_at, last_seen)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING user_id, user_name, user_email
    `;

    const user = await db.one(query, [user_name, user_email, hashedPassword]);

    // Kullanıcı ayarlarını oluştur
    await db.none(
      `
      INSERT INTO user_settings (user_id, theme, notification_enabled, language, font_size, last_updated)
      VALUES ($1, 'light', true, 'tr', 'medium', CURRENT_TIMESTAMP)
    `,
      [user.user_id]
    );

    res.json(user);
  } catch (error) {
    console.error("ERROR 💥", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { user_email, password } = req.body;

    // Debug için
    console.log("Login attempt:", { user_email, password });

    // Kullanıcıyı bul
    const user = await db.oneOrNone(
      "SELECT * FROM users WHERE user_email = $1",
      [user_email]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Kullanıcı bulunamadı",
      });
    }

    // Şifreyi kontrol et
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Geçersiz şifre",
      });
    }

    // Token oluştur
    const token = jwt.sign(
      {
        user_id: user.user_id,
        user_name: user.user_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Debug için
    console.log("Generated token:", token);

    // Yanıt gönder
    res.json({
      success: true,
      token,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { search } = req.query;

    const query = `
      SELECT user_id, user_name, user_email, profile_picture_url
      FROM users
      WHERE user_id != $1 
      AND (LOWER(user_name) LIKE LOWER($2) OR LOWER(user_email) LIKE LOWER($2))
      LIMIT 10
    `;

    const users = await db.any(query, [req.user.user_id, `%${search}%`]);
    res.json(users);
  } catch (error) {
    console.error("ERROR 💥", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const query = `
      SELECT u.user_id, u.user_name, u.profile_picture_url, c.contact_name
      FROM contacts c
      JOIN users u ON c.contact_id = u.user_id
      WHERE c.user_id = $1
      ORDER BY c.contact_name
    `;

    const contacts = await db.any(query, [req.user.user_id]);
    res.json(contacts);
  } catch (error) {
    console.error("ERROR 💥", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    // Debug için
    console.log("Profile request:", {
      user: req.user,
      headers: req.headers,
    });

    const query = `
      SELECT user_id, user_name, user_email, created_at, last_seen
      FROM users 
      WHERE user_id = $1
    `;

    const user = await db.one(query, [req.user.user_id]);

    res.json({
      success: true,
      status: "success",
      user,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      status: "error",
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    // Basit bir logout işlemi
    res.status(200).json({
      success: true,
      message: "Başarıyla çıkış yapıldı",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Çıkış yapılırken bir hata oluştu",
    });
  }
};

module.exports = {
  register,
  login,
  searchUsers,
  getContacts,
  getProfile,
  logout,
};
