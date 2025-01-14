const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // Authorization header'ını kontrol et
    const authHeader = req.headers.authorization;

    // Debug için
    console.log("Auth Header:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        status: "fail",
        message: "Token bulunamadı",
      });
    }

    // Bearer token'ı ayıkla
    const token = authHeader.split(" ")[1];

    // Debug için
    console.log("Extracted Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        status: "fail",
        message: "Geçersiz token formatı",
      });
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Debug için
    console.log("Decoded Token:", decoded);

    // Kullanıcı bilgisini request'e ekle
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token doğrulama hatası:", error);
    return res.status(401).json({
      success: false,
      status: "fail",
      message: "Geçersiz token",
    });
  }
};

module.exports = {
  verifyToken,
};
