const { AppError } = require("./errorHandler");

const validateChat = (req, res, next) => {
  const { chatType, chatName, participants } = req.body;

  if (!chatType) {
    throw new AppError("Sohbet tipi gereklidir", 400);
  }

  if (chatType === "group" && !chatName) {
    throw new AppError("Grup sohbeti için isim gereklidir", 400);
  }

  if (
    !participants ||
    !Array.isArray(participants) ||
    participants.length === 0
  ) {
    throw new AppError("En az bir katılımcı gereklidir", 400);
  }

  if (chatType === "private" && participants.length > 1) {
    throw new AppError("Özel sohbet sadece iki kişi arasında olabilir", 400);
  }

  next();
};

const validateMessage = (req, res, next) => {
  const { messageText, chatId } = req.body;

  if (!chatId) {
    throw new AppError("Sohbet ID gereklidir", 400);
  }

  if (!messageText || messageText.trim().length === 0) {
    throw new AppError("Mesaj metni gereklidir", 400);
  }

  if (messageText.length > 1000) {
    throw new AppError("Mesaj 1000 karakterden uzun olamaz", 400);
  }

  next();
};

const validateUser = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new AppError("Kullanıcı adı, e-posta ve şifre gereklidir", 400);
  }

  if (username.length < 3 || username.length > 30) {
    throw new AppError("Kullanıcı adı 3-30 karakter arasında olmalıdır", 400);
  }

  if (password.length < 6) {
    throw new AppError("Şifre en az 6 karakter olmalıdır", 400);
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new AppError("Geçerli bir e-posta adresi giriniz", 400);
  }

  next();
};

module.exports = {
  validateChat,
  validateMessage,
  validateUser,
};
