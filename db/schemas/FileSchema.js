const { Schema } = require("dynamoose");

module.exports = new Schema(
  {
    id: {
      type: String, // uuid
      hashKey: true,
    },
    subId: {
      type: String,
      rangeKey: true,
    },
    versionId: {
      type: String,
    },
    path: {
      type: String, // <subid>/<originalFileName>
    },
    clientName: {
      type: String,
    },
    lastAccessTime: {
      type: Date,
      default: Date.now(),
    },
    fileSize: {
      type: Number, // in bytes
    },
    fileType: {
      type: String, // enum: image, etc.
      enum: ["image"],
    },
    mimeType: {
      type: String, // application/pdf etc.
    },
    softDelete: {
      type: Boolean,
      default: false,
    },
    archiveId: {
      type: String,
      default: "",
    },
    jobId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
