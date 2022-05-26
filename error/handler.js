const { MulterError } = require("multer");
const CSError = require("./customErrors");

const errorHandler = (err, req, res, next) => {
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      err = CSError.FileSizeError();
    }
  }
  res.status(err.httpResponseCode || 500).json({
    errorMessage: err.message,
    errorCode: err.customCode || "CS101",
  });
};

module.exports = errorHandler;
