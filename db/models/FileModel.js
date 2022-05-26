const { model } = require("dynamoose");

const FileSchema = require("../schemas/FileSchema");

module.exports = model(`UserFiles`, FileSchema, {
  create: false,
}); // change db name
