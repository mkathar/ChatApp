const db = require("../db");
const { asyncHandler, AppError } = require("../middleware/errorHandler");

class ContactController {
  addContact = asyncHandler(async (req, res, next) => {
    const { contactId, contactName } = req.body;
    const userId = req.userId;

    if (userId === contactId) {
      throw new AppError("Kendinizi kişilere ekleyemezsiniz", 400);
    }

    await db.none(
      `INSERT INTO contacts (user_id, contact_id, contact_name, added_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
      [userId, contactId, contactName]
    );

    res.status(201).json({
      success: true,
      message: "Kişi başarıyla eklendi",
    });
  });

  getContacts = asyncHandler(async (req, res, next) => {
    const userId = req.userId;

    const contacts = await db.any(
      `SELECT c.*, u.user_name, u.user_email, u.profile_picture_url
       FROM contacts c
       JOIN users u ON c.contact_id = u.user_id
       WHERE c.user_id = $1
       ORDER BY c.contact_name`,
      [userId]
    );

    res.json({
      success: true,
      contacts,
    });
  });
}

module.exports = new ContactController();
