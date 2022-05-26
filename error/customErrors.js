class CSError extends Error {
  constructor(errorName, errMessage, errCode, httpResponseCode) {
    super();
    this.name = errorName;
    this.message = errMessage;
    this.customCode = errCode;
    this.httpResponseCode = httpResponseCode;
  }

  static FileDoesNotExist() {
    return new CSError(
      "CS_FileNotPresent",
      "File doesn't exist.",
      "CS103",
      404
    );
  }

  static FileSizeError() {
    return new CSError(
      "CS_FileSize",
      "File size limit exceeded.",
      "CS102",
      413
    );
  }

  static FileNotDeleted() {
    return new CSError(
      "CS_FilePresent",
      "File not deleted. Not present in archive.",
      "CS110",
      409
    );
  }

  static UserNotFound() {
    return new CSError("CS_UserNotFound", "User does not exist", "CS103", 404);
  }
}

module.exports = CSError;
