class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const handleDatabaseError = (err) => {
  console.error("Database Error:", err);
  return new AppError("Veritabanı işlemi sırasında bir hata oluştu", 500);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Geçersiz veri: ${errors.join(". ")}`, 400);
};

const handleJWTError = () => {
  return new AppError("Geçersiz token. Lütfen tekrar giriş yapın", 401);
};

const handleJWTExpiredError = () => {
  return new AppError("Oturumunuz sona erdi. Lütfen tekrar giriş yapın", 401);
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    // Geliştirme ortamında detaylı hata
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Üretim ortamında güvenli hata mesajı
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
      });
    } else {
      // Programlama veya bilinmeyen hatalar
      console.error("ERROR 💥", err);
      res.status(500).json({
        success: false,
        status: "error",
        message: "Bir şeyler yanlış gitti!",
      });
    }
  }
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  AppError,
  errorHandler,
  asyncHandler,
  handleDatabaseError,
  handleValidationError,
  handleJWTError,
  handleJWTExpiredError,
};
