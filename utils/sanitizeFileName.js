const sanitize = require("sanitize-s3-objectkey");

module.exports = function sanitizeFilename(name) {
  return sanitize(name);
};
