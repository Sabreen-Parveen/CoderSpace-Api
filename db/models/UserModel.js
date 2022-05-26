const dynamoose = require("dynamoose");

const Schema = require("../schemas/UserSchema");

module.exports = dynamoose.model(`User`, Schema, {
  create: false,
});
